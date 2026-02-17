<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    /**
     * Subir archivo al sistema de archivos
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        \Log::info('=== DEBUG FileUploadController::upload ===');
        \Log::info('Request all', ['data' => $request->all()]);
        \Log::info('Request files', ['files' => $request->allFiles()]);
        \Log::info('Has file', ['hasFile' => $request->hasFile('file')]);

        try {
            // Validar que venga un archivo
            $request->validate([
                'file' => 'required|file|max:20480', // Max 20MB
                'directory' => 'nullable|string'
            ]);

            \Log::info('✅ Validación pasada');

            $file = $request->file('file');

            // Capturar información del archivo ANTES de moverlo
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $mimeType = $file->getMimeType();
            $fileSize = $file->getSize();

            \Log::info('File info', [
                'name' => $originalName,
                'size' => $fileSize,
                'mime' => $mimeType,
                'extension' => $extension
            ]);

            $directory = $request->input('directory', ''); // Si no hay directorio, usar raíz
            \Log::info('Directory', ['directory' => $directory]);

            // Limpiar y sanitizar el directorio
            $directory = $this->sanitizeDirectory($directory);
            \Log::info('Directory sanitizado', ['directory' => $directory]);

            // Construir la ruta completa
            $basePath = 'files';
            $fullPath = $directory ? "$basePath/$directory" : $basePath;
            \Log::info('Full path', ['fullPath' => $fullPath]);

            // Crear directorio si no existe
            $publicPath = public_path($fullPath);
            \Log::info('Public path', ['publicPath' => $publicPath]);

            if (!file_exists($publicPath)) {
                \Log::info('Creando directorio...');
                mkdir($publicPath, 0755, true); // recursive = true
                \Log::info('✅ Directorio creado');
            } else {
                \Log::info('Directorio ya existe');
            }

            // Generar nombre único para el archivo
            $nameWithoutExtension = pathinfo($originalName, PATHINFO_FILENAME);

            // Sanitizar nombre del archivo
            $safeName = Str::slug($nameWithoutExtension);
            $fileName = $safeName . '_' . time() . '.' . $extension;
            \Log::info('Nombre archivo final', ['fileName' => $fileName]);

            // Mover el archivo INMEDIATAMENTE
            \Log::info('Moviendo archivo...');
            $file->move($publicPath, $fileName);
            \Log::info('✅ Archivo movido correctamente');

            // Construir la ruta relativa y la URL
            $relativePath = "$fullPath/$fileName";
            $url = asset($relativePath);
            \Log::info('Path relativo', ['relativePath' => $relativePath]);
            \Log::info('URL', ['url' => $url]);

            \Log::info('✅ Upload completado exitosamente');

            return response()->json([
                'success' => true,
                'message' => 'Archivo subido exitosamente',
                'data' => [
                    'filename' => $fileName,
                    'original_name' => $originalName,
                    'path' => $relativePath,
                    'url' => $url,
                    'size' => $fileSize,
                    'mime_type' => $mimeType,
                    'directory' => $directory ?: '/'
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('❌ Error de validación:', [
                'errors' => $e->errors(),
                'message' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('❌ Error general en upload:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al subir el archivo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sanitizar el directorio para evitar ataques de path traversal
     *
     * @param string $directory
     * @return string
     */
    private function sanitizeDirectory($directory)
    {
        if (empty($directory)) {
            return '';
        }

        // Remover caracteres peligrosos
        $directory = str_replace(['..', '\\'], '', $directory);

        // Remover slashes al inicio y final
        $directory = trim($directory, '/');

        // Convertir múltiples slashes en uno solo
        $directory = preg_replace('#/+#', '/', $directory);

        return $directory;
    }
}
