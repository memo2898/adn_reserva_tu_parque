import { useEffect, useState, useCallback } from 'react';
import { InputX, SelectX } from '../../../../lib/uiX';
import type { ActivoSeleccionado } from '../types';
import type { Activos } from '../../../activos/activos.types';
import type { Almacenes } from '../../../almacenes/almacenes.types';
import type { Categorias } from '../../../categorias/categorias.types';
import { getAll as almacenes_getAll } from '../../../almacenes/almacenes.service';
import { getAll as categorias_getAll } from '../../../categorias/categorias.service';
import './Components.css';

interface EditingData {
  marca: string;
  modelo: string;
  codigo_inventario_local: string;
  almacen_id: number | null;
  cantidad: number;
  unidad_medida: string;
  observacion: string;
}

interface ActivosSeleccionadosProps {
  activos: ActivoSeleccionado[];
  onRemove: (index: number) => void;
  onUpdateCantidad: (index: number, cantidad: number) => void;
  onUpdateObservacion?: (index: number, observacion: string) => void;
  onUpdateActivo?: (index: number, updates: Partial<ActivoSeleccionado>) => void;
  readOnly?: boolean;
  showCategoria?: boolean;
}

export function ActivosSeleccionados({
  activos,
  onRemove,
  onUpdateCantidad,
  onUpdateObservacion,
  onUpdateActivo,
  readOnly = false,
  showCategoria = false,
}: ActivosSeleccionadosProps) {
  // Estado para almacenes y categorías
  const [almacenes, setAlmacenes] = useState<Almacenes[]>([]);
  const [almacenesMap, setAlmacenesMap] = useState<Map<number, Almacenes>>(new Map());
  const [categoriasMap, setCategoriasMap] = useState<Map<number, Categorias>>(new Map());

  // Estado para el acordeón expandido
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Estado temporal para edición
  const [editingData, setEditingData] = useState<EditingData | null>(null);
  const [editErrors, setEditErrors] = useState<string[]>([]);

  // Cargar almacenes y categorías al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [almacenesData, categoriasData] = await Promise.all([
          almacenes_getAll(),
          categorias_getAll(),
        ]);

        setAlmacenes(almacenesData);

        const almMap = new Map<number, Almacenes>();
        almacenesData.forEach((a) => {
          if (a.id) almMap.set(a.id, a);
        });
        setAlmacenesMap(almMap);

        const catMap = new Map<number, Categorias>();
        categoriasData.forEach((c) => {
          if (c.id) catMap.set(c.id, c);
        });
        setCategoriasMap(catMap);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    fetchData();
  }, []);

  // Helper para obtener nombre del almacén
  const getAlmacenNombre = (almacenId?: number): string => {
    if (!almacenId) return 'Sin almacen';
    const almacen = almacenesMap.get(almacenId);
    return almacen?.nombre || `Almacen ${almacenId}`;
  };

  // Helper para obtener nombre de la categoría
  const getCategoriaNombre = (categoriaId?: number): string => {
    if (!categoriaId) return 'Sin categoria';
    const categoria = categoriasMap.get(categoriaId);
    return categoria?.nombre || `Categoria ${categoriaId}`;
  };

  // Helper para verificar si la categoría es unitaria
  const esUnitario = (categoriaId?: number): boolean => {
    if (!categoriaId) return false;
    const categoria = categoriasMap.get(categoriaId);
    return categoria?.tipo_control === 'UNITARIO';
  };

  // Inicializar datos de edición cuando se expande
  const initEditingData = useCallback((item: ActivoSeleccionado) => {
    setEditingData({
      marca: item.activo.marca || '',
      modelo: item.activo.modelo || '',
      codigo_inventario_local: item.activo.codigo_inventario_local || '',
      almacen_id: item.activo.almacen_id || null,
      cantidad: item.cantidad,
      unidad_medida: item.activo.unidad_medida || 'UNIDAD',
      observacion: item.observacion || '',
    });
    setEditErrors([]);
  }, []);

  // Abrir acordeón (solo si no hay otro abierto)
  const openExpand = (index: number) => {
    // Si ya hay uno abierto, no permitir abrir otro
    if (expandedIndex !== null) return;

    setExpandedIndex(index);
    initEditingData(activos[index]);
  };

  // Actualizar campo en estado temporal
  const handleEditField = (field: keyof EditingData, value: unknown) => {
    if (!editingData) return;
    setEditingData({
      ...editingData,
      [field]: value,
    });
    setEditErrors([]);
  };

  // Validar datos de edición
  const validateEditingData = (): boolean => {
    if (!editingData) return false;
    const errors: string[] = [];

    if (!editingData.marca.trim()) {
      errors.push('La marca es requerida');
    }
    if (!editingData.modelo.trim()) {
      errors.push('El modelo es requerido');
    }
    if (!editingData.almacen_id) {
      errors.push('Debe seleccionar un almacen');
    }
    if (editingData.cantidad < 1) {
      errors.push('La cantidad debe ser al menos 1');
    }

    setEditErrors(errors);
    return errors.length === 0;
  };

  // Guardar cambios
  const handleSaveChanges = () => {
    if (expandedIndex === null || !editingData || !onUpdateActivo) return;

    if (!validateEditingData()) return;

    const item = activos[expandedIndex];
    onUpdateActivo(expandedIndex, {
      activo: {
        ...item.activo,
        marca: editingData.marca,
        modelo: editingData.modelo,
        codigo_inventario_local: editingData.codigo_inventario_local || undefined,
        almacen_id: editingData.almacen_id || undefined,
        unidad_medida: editingData.unidad_medida,
      },
      cantidad: editingData.cantidad,
      observacion: editingData.observacion || undefined,
    });

    // Cerrar acordeón
    setExpandedIndex(null);
    setEditingData(null);
    setEditErrors([]);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setExpandedIndex(null);
    setEditingData(null);
    setEditErrors([]);
  };

  if (activos.length === 0) {
    return null;
  }

  return (
    <div className="activos-seleccionados">
      <div className="activos-seleccionados-header">
        <span className="activos-seleccionados-title">
          {readOnly ? 'Activos a devolver' : 'Activos seleccionados'}
        </span>
        <span className="activos-seleccionados-count">{activos.length} item(s)</span>
      </div>

      <div className="activos-seleccionados-list">
        {activos.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div key={index} className={`activo-seleccionado-item ${isExpanded ? 'activo-seleccionado-item--expanded' : ''}`}>
              {/* Header del item (siempre visible) */}
              <div className="activo-seleccionado-row">
                <div className="activo-seleccionado-info">
                  <div className="activo-seleccionado-main">
                    <span className="activo-seleccionado-nombre">
                      {item.activo.marca} {item.activo.modelo}
                    </span>
                    {item.isNew && (
                      <span className="activo-seleccionado-badge activo-seleccionado-badge--new">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <div className="activo-seleccionado-meta">
                    <span>{item.activo.codigo_inventario_local || 'Sin codigo'}</span>
                    <span className="activo-seleccionado-almacen">
                      {getAlmacenNombre(item.activo.almacen_id)}
                    </span>
                    {showCategoria && item.activo.categoria_id && (
                      <span className="activo-seleccionado-categoria">
                        {getCategoriaNombre(item.activo.categoria_id)}
                      </span>
                    )}
                  </div>
                </div>

                {!readOnly && (
                  <div className="activo-seleccionado-controls">
                    {!isExpanded && !esUnitario(item.activo.categoria_id) && (
                      <div className="activo-seleccionado-cantidad">
                        <label>Cant:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => onUpdateCantidad(index, parseInt(e.target.value) || 1)}
                        />
                      </div>
                    )}
                    {onUpdateActivo && !isExpanded && (
                      <button
                        type="button"
                        className={`activo-seleccionado-edit ${expandedIndex !== null ? 'activo-seleccionado-edit--disabled' : ''}`}
                        onClick={() => openExpand(index)}
                        disabled={expandedIndex !== null}
                        title={expandedIndex !== null ? 'Guarde o cancele la edicion actual' : 'Editar activo'}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      className="activo-seleccionado-remove"
                      onClick={() => onRemove(index)}
                      title="Quitar activo"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {readOnly && (
                  <div className="activo-seleccionado-cantidad-readonly">
                    Cantidad: {item.cantidad}
                  </div>
                )}
              </div>

              {/* Acordeón de edición (solo visible cuando está expandido) */}
              {isExpanded && onUpdateActivo && !readOnly && editingData && (
                <div className="activo-seleccionado-accordion">
                  <div className="activo-seleccionado-form-grid">
                    <InputX
                      name={`marca-${index}`}
                      label="Marca"
                      defaultValue={editingData.marca}
                      onChange={(value) => handleEditField('marca', value)}
                      rules={{ validations: [{ type: 'required', message: 'Requerido' }] }}
                    />
                    <InputX
                      name={`modelo-${index}`}
                      label="Modelo"
                      defaultValue={editingData.modelo}
                      onChange={(value) => handleEditField('modelo', value)}
                      rules={{ validations: [{ type: 'required', message: 'Requerido' }] }}
                    />
                    <InputX
                      name={`codigo-${index}`}
                      label="Codigo de inventario"
                      placeholder="Ej: INV-2026-001"
                      defaultValue={editingData.codigo_inventario_local}
                      onChange={(value) => handleEditField('codigo_inventario_local', value)}
                    />
                    <SelectX
                      name={`almacen-${index}`}
                      label="Almacen"
                      placeholder="Seleccione un almacen"
                      options={almacenes.map((a) => ({
                        value: String(a.id),
                        label: a.nombre || `Almacen ${a.id}`,
                      }))}
                      defaultValue={editingData.almacen_id ? String(editingData.almacen_id) : ''}
                      onChange={(value) => handleEditField('almacen_id', value ? Number(value) : null)}
                      rules={{ validations: [{ type: 'required', message: 'Requerido' }] }}
                    />
                    {!esUnitario(item.activo.categoria_id) && (
                      <>
                        <InputX
                          name={`cantidad-${index}`}
                          label="Cantidad"
                          type="number"
                          defaultValue={String(editingData.cantidad)}
                          onChange={(value) => handleEditField('cantidad', Number(value) || 1)}
                          rules={{ validations: [{ type: 'required', message: 'Requerido' }] }}
                        />
                        <InputX
                          name={`unidad-${index}`}
                          label="Unidad de medida"
                          defaultValue={editingData.unidad_medida}
                          onChange={(value) => handleEditField('unidad_medida', value)}
                        />
                      </>
                    )}
                  </div>
                  <div className="activo-seleccionado-form-full">
                    <InputX
                      name={`observacion-${index}`}
                      label="Observacion"
                      placeholder="Observacion del activo..."
                      defaultValue={editingData.observacion}
                      onChange={(value) => handleEditField('observacion', value as string)}
                    />
                  </div>

                  {/* Errores de validación */}
                  {editErrors.length > 0 && (
                    <div className="activo-seleccionado-errors">
                      {editErrors.map((error, i) => (
                        <p key={i} className="activo-seleccionado-error">{error}</p>
                      ))}
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="activo-seleccionado-actions">
                    <button
                      type="button"
                      className="activo-seleccionado-btn activo-seleccionado-btn--secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="activo-seleccionado-btn activo-seleccionado-btn--primary"
                      onClick={handleSaveChanges}
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              )}

              {/* Campo de observación simple (cuando no está expandido) */}
              {!isExpanded && onUpdateObservacion && !readOnly && (
                <div className="activo-seleccionado-observacion">
                  <input
                    type="text"
                    placeholder="Observacion (opcional)..."
                    value={item.observacion || ''}
                    onChange={(e) => onUpdateObservacion(index, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="activos-seleccionados-footer">
        <span>
          Total: {activos.reduce((sum, item) => sum + item.cantidad, 0)} unidad(es)
        </span>
      </div>
    </div>
  );
}
