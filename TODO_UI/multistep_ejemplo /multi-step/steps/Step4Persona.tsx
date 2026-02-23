import { useState, useEffect } from 'react';
import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { InputX, SelectX } from '../../../../lib/uiX';
import { MOTIVOS_DESCARGO, type PersonaTransaccion } from '../types';
import './Steps.css';
import { getByDocumento, existsByDocumento } from '../../../personas/personas.service';
import { getAll as tipodoc_getall } from '../../../tiposdocumentos/tiposdocumentos.service';
import { getAll as direcciones_getAll } from '../../../direcciones/direcciones.service';
import { getByDireccion } from '../../../departamentos/departamentos.service';

export function Step4Persona() {
  const { state, dispatch, requiresFechaDevolucion, requiresMotivoDescargo } = useTransaccionWizardContext();

  const isEntrada = state.tipoTransaccion === 'ENTRADA';

  // ============================================
  // NUEVO: Función para inicializar el estado desde state.persona
  // ============================================
  const initializeFromPersona = (persona: PersonaTransaccion | null) => {
    console.log('🔧 [INIT] initializeFromPersona llamada con:', persona);
    
    if (!persona) {
      console.log('🔧 [INIT] persona es null, retornando estado vacío');
      return {
        tipoDocumentoId: null,
        numeroDocumento: '',
        isPersonaJuridica: false,
        clasificacion: null,
        codigoEmpleado: '',
        direccionId: null,
        departamentoId: null,
        formDataFisica: {
          nombre: '',
          apellido: '',
          cargo: '',
          telefono: '',
          correo: '',
        },
        formDataJuridica: {
          razon_social: '',
          nombre_comercial: '',
          telefono: '',
          correo: '',
        },
        personaEncontrada: false,
        mensajeBusqueda: '',
      };
    }

    const esJuridica = persona.tipo_persona === 'JURIDICA';
    console.log('🔧 [INIT] Tipo de persona:', persona.tipo_persona, '(esJuridica:', esJuridica + ')');
    // CRÍTICO: Obtener direccion_id de múltiples fuentes posibles
    const direccionIdRestaurado = persona.departamento?.direccion_id ?? persona.direccion_id ?? null;

    console.log('🔧 [INIT] Datos de empleado en persona:', {
      clasificacion: persona.clasificacion,
      codigo_empleado: persona.codigo_empleado,
      departamento_id: persona.departamento_id,
      departamento: persona.departamento,
      direccion_id_raiz: persona.direccion_id,
      direccion_id_restaurado: direccionIdRestaurado
    });

    const result = {
      tipoDocumentoId: persona.tipo_documento_id ?? null,
      numeroDocumento: persona.numero_documento ?? '',
      isPersonaJuridica: esJuridica,
      clasificacion: (persona.clasificacion as 'EMPLEADO' | 'VISITANTE' | 'CONTRATISTA') ?? null,
      codigoEmpleado: persona.codigo_empleado ?? '',
      direccionId: direccionIdRestaurado,
      departamentoId: persona.departamento_id ?? null,
      formDataFisica: esJuridica ? {
        nombre: '',
        apellido: '',
        cargo: '',
        telefono: '',
        correo: '',
      } : {
        nombre: persona.nombre ?? '',
        apellido: persona.apellido ?? '',
        cargo: persona.cargo ?? '',
        telefono: persona.telefono ?? '',
        correo: persona.correo ?? '',
      },
      formDataJuridica: esJuridica ? {
        razon_social: persona.razon_social ?? '',
        nombre_comercial: persona.nombre_comercial ?? '',
        telefono: persona.telefono ?? '',
        correo: persona.correo ?? '',
      } : {
        razon_social: '',
        nombre_comercial: '',
        telefono: '',
        correo: '',
      },
      personaEncontrada: !persona.isNew,
      mensajeBusqueda: persona.isNew
        ? (esJuridica ? 'Nueva empresa - Complete los datos' : 'Nueva persona - Complete los datos')
        : '✓ Persona cargada desde memoria',
    };
    
    console.log('🔧 [INIT] Estado inicializado:', result);
    return result;
  };

  // ============================================
  // Estados del formulario - Inicializados desde state.persona
  // ============================================
  const initialFormState = initializeFromPersona(state.persona);
  
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [tipoDocumentoId, setTipoDocumentoId] = useState<number | null>(initialFormState.tipoDocumentoId);
  const [numeroDocumento, setNumeroDocumento] = useState(initialFormState.numeroDocumento);
  const [isPersonaJuridica, setIsPersonaJuridica] = useState(initialFormState.isPersonaJuridica);
  const [clasificacion, setClasificacion] = useState<'EMPLEADO' | 'VISITANTE' | 'CONTRATISTA' | null>(initialFormState.clasificacion);
  const [codigoEmpleado, setCodigoEmpleado] = useState(initialFormState.codigoEmpleado);
  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [direccionId, setDireccionId] = useState<number | null>(initialFormState.direccionId);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [departamentoId, setDepartamentoId] = useState<number | null>(initialFormState.departamentoId);
  const [formDataFisica, setFormDataFisica] = useState(initialFormState.formDataFisica);
  const [formDataJuridica, setFormDataJuridica] = useState(initialFormState.formDataJuridica);
  const [buscando, setBuscando] = useState(false);
  const [personaEncontrada, setPersonaEncontrada] = useState(initialFormState.personaEncontrada);
  const [mensajeBusqueda, setMensajeBusqueda] = useState(initialFormState.mensajeBusqueda);

  const isEmpleado = clasificacion === 'EMPLEADO';

  // ============================================
  // NUEVO: Sincronizar con state.persona cuando cambia
  // Este efecto se ejecuta SIEMPRE que state.persona cambia,
  // incluyendo cuando regresamos al paso
  // ============================================
  useEffect(() => {
    console.log('🔄 [SYNC] useEffect de sincronización ejecutándose');
    console.log('📦 [SYNC] state.persona:', state.persona);
    console.log('📋 [SYNC] Estado local actual:', {
      tipoDocumentoId,
      numeroDocumento,
      direccionId,
      departamentoId,
      clasificacion,
      codigoEmpleado
    });

    // Solo sincronizar si hay cambios reales
    if (state.persona) {
      const personaTipoDoc = state.persona.tipo_documento_id;
      const personaNumDoc = state.persona.numero_documento;
      
      console.log('✅ [SYNC] state.persona existe');
      console.log('🔍 [SYNC] Comparando:', {
        personaTipoDoc,
        tipoDocumentoId,
        personaNumDoc,
        numeroDocumento,
        sonDiferentes: personaTipoDoc !== tipoDocumentoId || personaNumDoc !== numeroDocumento
      });
      
      // Si los datos básicos son diferentes, actualizar todo
      if (personaTipoDoc !== tipoDocumentoId || personaNumDoc !== numeroDocumento) {
        console.log('🔄 [SYNC] Sincronizando datos desde state.persona...');
        const newState = initializeFromPersona(state.persona);
        
        console.log('📝 [SYNC] Nuevo estado calculado:', newState);
        
        setTipoDocumentoId(newState.tipoDocumentoId);
        setNumeroDocumento(newState.numeroDocumento);
        setIsPersonaJuridica(newState.isPersonaJuridica);
        setClasificacion(newState.clasificacion);
        setCodigoEmpleado(newState.codigoEmpleado);
        setFormDataFisica(newState.formDataFisica);
        setFormDataJuridica(newState.formDataJuridica);
        setPersonaEncontrada(newState.personaEncontrada);
        setMensajeBusqueda(newState.mensajeBusqueda);
        
        // IMPORTANTE: Para dirección y departamento, establecer los valores
        // pero los departamentos se cargarán en su propio useEffect
        if (newState.direccionId) {
          console.log('🏢 [SYNC] Estableciendo direccionId:', newState.direccionId);
          console.log('🏢 [SYNC] departamentoId en state.persona:', state.persona.departamento_id);
          setDireccionId(newState.direccionId);
          // departamentoId se establecerá después de que se carguen los departamentos
        } else {
          console.log('🏢 [SYNC] No hay direccionId, limpiando dirección y departamento');
          setDireccionId(null);
          setDepartamentoId(null);
        }
        
        console.log('✅ [SYNC] Sincronización completada');
      } else {
        console.log('⏭️ [SYNC] Datos ya están sincronizados, no se requiere actualización');
      }
    } else if (tipoDocumentoId !== null || numeroDocumento !== '') {
      console.log('🧹 [SYNC] state.persona es null pero hay datos locales, limpiando...');
      // Si state.persona es null pero tenemos datos locales, limpiar
      const emptyState = initializeFromPersona(null);
      setTipoDocumentoId(emptyState.tipoDocumentoId);
      setNumeroDocumento(emptyState.numeroDocumento);
      setIsPersonaJuridica(emptyState.isPersonaJuridica);
      setClasificacion(emptyState.clasificacion);
      setCodigoEmpleado(emptyState.codigoEmpleado);
      setDireccionId(emptyState.direccionId);
      setDepartamentoId(emptyState.departamentoId);
      setFormDataFisica(emptyState.formDataFisica);
      setFormDataJuridica(emptyState.formDataJuridica);
      setPersonaEncontrada(emptyState.personaEncontrada);
      setMensajeBusqueda(emptyState.mensajeBusqueda);
      console.log('✅ [SYNC] Limpieza completada');
    } else {
      console.log('ℹ️ [SYNC] No hay state.persona ni datos locales');
    }
  }, [state.persona]); // Solo depende de state.persona

  // ============================================
  // Cargar tipos de documento al montar
  // ============================================
  useEffect(() => {
    const loadTiposDocumento = async () => {
      try {
        const tipos = await tipodoc_getall();
        setTiposDocumento(tipos);
      } catch (error) {
        console.error('Error cargando tipos de documento:', error);
      }
    };
    loadTiposDocumento();
  }, []);

  // ============================================
  // Cargar direcciones al montar (solo si no es persona jurídica)
  // ============================================
  useEffect(() => {
    if (!isPersonaJuridica) {
      const loadDirecciones = async () => {
        try {
          const dirs = await direcciones_getAll();
          setDirecciones(dirs);
        } catch (error) {
          console.error('Error cargando direcciones:', error);
        }
      };
      loadDirecciones();
    }
  }, [isPersonaJuridica]);

  // ============================================
  // Cargar departamentos cuando cambia la dirección
  // ============================================
  useEffect(() => {
    console.log('🏢 [DEPTS] useEffect de departamentos ejecutándose');
    console.log('🏢 [DEPTS] direccionId actual:', direccionId);
    console.log('🏢 [DEPTS] departamentoId actual:', departamentoId);
    console.log('🏢 [DEPTS] state.persona?.departamento_id:', state.persona?.departamento_id);
    console.log('🏢 [DEPTS] state.persona?.departamento?.direccion_id:', state.persona?.departamento?.direccion_id);

    const loadDepartamentos = async () => {
      if (!direccionId) {
        console.log('⚠️ [DEPTS] No hay direccionId, limpiando departamentos');
        setDepartamentos([]);
        // Solo limpiar departamentoId si NO tenemos datos de persona pendientes
        if (!state.persona?.departamento_id) {
          console.log('🧹 [DEPTS] Limpiando departamentoId (no hay datos pendientes)');
          setDepartamentoId(null);
        } else {
          console.log('⏸️ [DEPTS] NO limpiando departamentoId (hay datos pendientes en state.persona)');
        }
        return;
      }

      console.log('📥 [DEPTS] Cargando departamentos para direccionId:', direccionId);

      try {
        const depts = await getByDireccion(direccionId);
        console.log('✅ [DEPTS] Departamentos cargados:', depts);
        setDepartamentos(depts);
        
        // IMPORTANTE: Si tenemos un departamento pendiente de state.persona,
        // establecerlo ahora que ya cargamos los departamentos
        if (state.persona?.departamento_id && 
            state.persona?.departamento?.direccion_id === direccionId) {
          console.log('🔍 [DEPTS] Hay departamento pendiente, verificando...');
          console.log('🔍 [DEPTS] Buscando departamento_id:', state.persona.departamento_id);
          
          // Verificar que el departamento existe en la lista cargada
          const existeDept = depts.find(d => d.id === state.persona.departamento_id);
          console.log('🔍 [DEPTS] Departamento encontrado:', existeDept);
          
          if (existeDept) {
            console.log('✅ [DEPTS] Estableciendo departamentoId:', state.persona.departamento_id);
            setDepartamentoId(state.persona.departamento_id);
          } else {
            console.log('[DEPTS] Departamento NO encontrado en la lista cargada');
          }
        } else {
          console.log('ℹ️ [DEPTS] No hay departamento pendiente o la dirección no coincide');
          console.log('ℹ️ [DEPTS] Condiciones:', {
            tieneDepartamento: !!state.persona?.departamento_id,
            direccionCoincide: state.persona?.departamento?.direccion_id === direccionId
          });
        }
      } catch (error) {
        console.error('[DEPTS] Error cargando departamentos:', error);
        setDepartamentos([]);
      }
    };

    loadDepartamentos();
  }, [direccionId, state.persona]);

  // ============================================
  // Detectar si el tipo de documento es RNC (persona jurídica)
  // ============================================
  useEffect(() => {
    if (tipoDocumentoId && tiposDocumento.length > 0) {
      const tipoSeleccionado = tiposDocumento.find(t => t.id === tipoDocumentoId);
      const esRNC = tipoSeleccionado?.codigo === 'RNC' ||
                    tipoSeleccionado?.nombre?.toUpperCase().includes('RNC');

      // Solo actualizar si cambió realmente
      if (esRNC !== isPersonaJuridica) {
        setIsPersonaJuridica(esRNC);

        // Limpiar formularios al cambiar tipo
        setFormDataFisica({
          nombre: '',
          apellido: '',
          cargo: '',
          telefono: '',
          correo: '',
        });
        setFormDataJuridica({
          razon_social: '',
          nombre_comercial: '',
          telefono: '',
          correo: '',
        });

        // Limpiar campos de empleado si cambia a jurídica
        if (esRNC) {
          setClasificacion(null);
          setCodigoEmpleado('');
          setDireccionId(null);
          setDepartamentoId(null);
        }

        setPersonaEncontrada(false);
        setMensajeBusqueda('');
      }
    }
  }, [tipoDocumentoId, tiposDocumento, isPersonaJuridica]);

  // ============================================
  // NUEVO: Limpiar datos cuando cambia el tipo de documento
  // (incluso si no cambia entre física/jurídica)
  // ============================================
  useEffect(() => {
    // Si hay una persona encontrada con un tipo de documento diferente, limpiar inmediatamente
    if (state.persona &&
        state.persona.tipo_documento_id !== tipoDocumentoId &&
        tipoDocumentoId !== null) {
      console.log('🧹 [TIPO_DOC] Tipo de documento cambió, limpiando datos de persona anterior');
      console.log('🧹 [TIPO_DOC] Anterior:', state.persona.tipo_documento_id, '-> Nuevo:', tipoDocumentoId);

      // Limpiar formularios
      setFormDataFisica({
        nombre: '',
        apellido: '',
        cargo: '',
        telefono: '',
        correo: '',
      });
      setFormDataJuridica({
        razon_social: '',
        nombre_comercial: '',
        telefono: '',
        correo: '',
      });

      // Limpiar campos de empleado
      setClasificacion(null);
      setCodigoEmpleado('');
      setDireccionId(null);
      setDepartamentoId(null);

      // Limpiar estado de búsqueda
      setPersonaEncontrada(false);
      setMensajeBusqueda('');

      // Limpiar estado global
      dispatch({ type: 'SET_PERSONA', payload: null });
    }
  }, [tipoDocumentoId, state.persona, dispatch]);

  // ============================================
  // Buscar persona automáticamente cuando cambian tipo_doc y numero_doc
  // ============================================
  useEffect(() => {
    const buscarPersona = async () => {
      // Validar que tengamos tipo de documento y al menos 3 caracteres
      if (!tipoDocumentoId || numeroDocumento.length < 3) {
        setPersonaEncontrada(false);
        setMensajeBusqueda('');
        return;
      }

      // Si ya tenemos persona en el estado con los mismos datos, no buscar de nuevo
      if (state.persona &&
          state.persona.tipo_documento_id === tipoDocumentoId &&
          state.persona.numero_documento === numeroDocumento) {
        // Ya tenemos los datos, solo mostrar el mensaje apropiado
        if (state.persona.isNew) {
          setPersonaEncontrada(false);
          setMensajeBusqueda(
            isPersonaJuridica
              ? 'Nueva empresa - Complete los datos'
              : 'Nueva persona - Complete los datos'
          );
        } else {
          setPersonaEncontrada(true);
          setMensajeBusqueda('✓ Persona cargada desde memoria');
        }
        return;
      }

      setBuscando(true);
      setMensajeBusqueda('Buscando...');

      try {
        // Verificar si existe
        const { exists } = await existsByDocumento(tipoDocumentoId, numeroDocumento);

        if (exists) {
          // Traer los datos completos
          const persona = await getByDocumento(tipoDocumentoId, numeroDocumento);
          
          // Autocompletar el formulario según el tipo
          if (isPersonaJuridica) {
            setFormDataJuridica({
              razon_social: persona.razon_social || '',
              nombre_comercial: persona.nombre_comercial || '',
              telefono: persona.telefono || '',
              correo: persona.correo || '',
            });
          } else {
            setFormDataFisica({
              nombre: persona.nombre || '',
              apellido: persona.apellido || '',
              cargo: persona.cargo || '',
              telefono: persona.telefono || '',
              correo: persona.correo || '',
            });
            
            // Autocompletar datos de empleado
            setClasificacion(persona.clasificacion || null);
            setCodigoEmpleado(persona.codigo_empleado || '');
            
            if (persona.departamento_id && persona.departamento?.direccion_id) {
              setDireccionId(persona.departamento.direccion_id);
              setDepartamentoId(persona.departamento_id);
            }
          }

          setPersonaEncontrada(true);
          setMensajeBusqueda('✓ Persona encontrada en el sistema');

          // Actualizar el estado global con la persona existente
          dispatch({
            type: 'SET_PERSONA',
            payload: {
              ...persona,
              isNew: false,
            } as PersonaTransaccion,
          });
        } else {
          // No existe, limpiar el formulario para nueva persona
          if (isPersonaJuridica) {
            setFormDataJuridica({
              razon_social: '',
              nombre_comercial: '',
              telefono: '',
              correo: '',
            });
          } else {
            setFormDataFisica({
              nombre: '',
              apellido: '',
              cargo: '',
              telefono: '',
              correo: '',
            });
            
            // Limpiar campos de empleado
            setClasificacion(null);
            setCodigoEmpleado('');
            setDireccionId(null);
            setDepartamentoId(null);
          }
          
          setPersonaEncontrada(false);
          setMensajeBusqueda(
            isPersonaJuridica 
              ? 'Nueva empresa - Complete los datos' 
              : 'Nueva persona - Complete los datos'
          );

          // Limpiar el estado global
          dispatch({ type: 'SET_PERSONA', payload: null });
        }
      } catch (error) {
        console.error('Error buscando persona:', error);
        setMensajeBusqueda('');
        setPersonaEncontrada(false);
      } finally {
        setBuscando(false);
      }
    };

    // Debounce de 500ms
    const timer = setTimeout(buscarPersona, 500);
    return () => clearTimeout(timer);
  }, [tipoDocumentoId, numeroDocumento, isPersonaJuridica, dispatch, state.persona]);

  // ============================================
  // Actualizar estado global cuando cambian los datos del formulario
  // ============================================
  useEffect(() => {
    console.log('💾 [SAVE] useEffect de guardado ejecutándose');
    console.log('💾 [SAVE] Estado actual:', {
      tipoDocumentoId,
      numeroDocumento,
      isPersonaJuridica,
      clasificacion,
      codigoEmpleado,
      departamentoId,
      isEmpleado
    });

    if (!tipoDocumentoId || !numeroDocumento) {
      console.log('⏭️ [SAVE] Falta tipoDocumentoId o numeroDocumento, no se guarda');
      return;
    }

    let personaData: Partial<PersonaTransaccion> = {
      tipo_documento_id: tipoDocumentoId,
      numero_documento: numeroDocumento,
      isNew: !personaEncontrada,
    };

    if (isPersonaJuridica) {
      // Validar que tenga al menos razón social
      if (!formDataJuridica.razon_social) {
        console.log('⏭️ [SAVE] Persona jurídica sin razón social, no se guarda');
        return;
      }
      
      personaData = {
        ...personaData,
        tipo_persona: 'JURIDICA' as const,
        clasificacion: 'PROVEEDOR' as const,
        razon_social: formDataJuridica.razon_social,
        nombre_comercial: formDataJuridica.nombre_comercial,
        telefono: formDataJuridica.telefono,
        correo: formDataJuridica.correo,
        nombre: formDataJuridica.nombre_comercial || formDataJuridica.razon_social,
      };
      
      console.log('💾 [SAVE] Guardando persona jurídica:', personaData);
    } else {
      // Validar que tenga al menos nombre
      if (!formDataFisica.nombre) {
        console.log('⏭️ [SAVE] Persona física sin nombre, no se guarda');
        return;
      }
      
      // Validar campos de empleado si es empleado
      if (isEmpleado && (!departamentoId || !codigoEmpleado || !direccionId)) {
        console.log('⏭️ [SAVE] Empleado sin departamento, código o dirección, no se guarda');
        console.log('⏭️ [SAVE] departamentoId:', departamentoId, 'codigoEmpleado:', codigoEmpleado, 'direccionId:', direccionId);
        return;
      }
      
      personaData = {
        ...personaData,
        tipo_persona: 'FISICA' as const,
        clasificacion: clasificacion || 'VISITANTE' as const,
        nombre: formDataFisica.nombre,
        apellido: formDataFisica.apellido,
        cargo: formDataFisica.cargo,
        telefono: formDataFisica.telefono,
        correo: formDataFisica.correo,
        ...(isEmpleado && departamentoId && direccionId && {
          codigo_empleado: codigoEmpleado,
          departamento_id: departamentoId,
          // CRÍTICO: Guardar direccion_id tanto a nivel raíz como en departamento
          direccion_id: direccionId,
          departamento: {
            id: departamentoId,
            direccion_id: direccionId,
          },
        }),
      };
      
      console.log('💾 [SAVE] Guardando persona física:', personaData);
      console.log('💾 [SAVE] Datos de empleado incluidos:', isEmpleado ? { 
        codigo_empleado: codigoEmpleado, 
        departamento_id: departamentoId,
        departamento: personaData.departamento 
      } : 'NO');
    }

    console.log('✅ [SAVE] Dispatching SET_PERSONA con:', personaData);
    dispatch({
      type: 'SET_PERSONA',
      payload: personaData as PersonaTransaccion,
    });
  }, [
    formDataFisica, 
    formDataJuridica, 
    tipoDocumentoId, 
    numeroDocumento, 
    personaEncontrada, 
    isPersonaJuridica,
    clasificacion,
    codigoEmpleado,
    departamentoId,
    isEmpleado,
    dispatch
  ]);

  // ============================================
  // Handlers de cambios en formularios
  // ============================================
  const handleFormFisicaChange = (field: keyof typeof formDataFisica, value: string) => {
    setFormDataFisica((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormJuridicaChange = (field: keyof typeof formDataJuridica, value: string) => {
    setFormDataJuridica((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFechaDevolucionChange = (value: string) => {
    dispatch({ type: 'SET_FECHA_DEVOLUCION', payload: value });
  };

  const handleMotivoDescargoChange = (value: string) => {
    dispatch({
      type: 'SET_MOTIVO_DESCARGO',
      payload: {
        motivo: value as any,
        comentario: state.comentarioDescargo,
        documento: state.documentoAprobacionDescargo,
      },
    });
  };

  const handleComentarioDescargoChange = (value: string) => {
    dispatch({
      type: 'SET_MOTIVO_DESCARGO',
      payload: {
        motivo: state.motivoDescargo!,
        comentario: value,
        documento: state.documentoAprobacionDescargo,
      },
    });
  };

  const handleDocumentoAprobacionChange = (value: string) => {
    dispatch({
      type: 'SET_MOTIVO_DESCARGO',
      payload: {
        motivo: state.motivoDescargo!,
        comentario: state.comentarioDescargo,
        documento: value,
      },
    });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">
          {isEntrada ? 'Datos del Solicitante' : 'Datos del Receptor'}
        </h2>
        <p className="step-description">
          {isEntrada
            ? 'Identifique quien entrega o devuelve el activo'
            : 'Identifique a quien se entrega el activo'}
        </p>
      </div>

      {/* Formulario de Persona - Siempre visible */}
      <div className="step-section">
        <div className="step-form">
          {/* Tipo de Documento y Número de Documento */}
          <div className="step-form-row">
            <div className="step-form-group">
              <SelectX
                name="tipo_documento_id"
                label="Tipo de Documento"
                placeholder="Seleccione tipo..."
                options={tiposDocumento.map((tipo) => ({
                  value: tipo.id.toString(),
                  label: tipo.nombre,
                }))}
                value={tipoDocumentoId?.toString()}
                onChange={(value) => setTipoDocumentoId(Number(value))}
                rules={{
                  validations: [{ type: 'required', message: 'Requerido' }],
                }}
              />
            </div>
            <div className="step-form-group">
              <InputX
                name="numero_documento"
                label="Número de Documento"
                placeholder={isPersonaJuridica ? 'Ej: 130123456' : 'Ej: 001-2345678-9'}
                value={numeroDocumento}
                onChange={(value) => setNumeroDocumento(value as string)}
                rules={{
                  validations: [{ type: 'required', message: 'Requerido' }],
                }}
              />
            </div>
          </div>

          {/* Mensaje de búsqueda */}
          {mensajeBusqueda && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                backgroundColor: personaEncontrada ? '#dcfce7' : buscando ? '#fef3c7' : '#e0f2fe',
                color: personaEncontrada ? '#166534' : buscando ? '#92400e' : '#0c4a6e',
                border: `1px solid ${personaEncontrada ? '#86efac' : buscando ? '#fcd34d' : '#7dd3fc'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {buscando && (
                <svg
                  className="animate-spin"
                  style={{ width: '1rem', height: '1rem' }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span style={{ fontWeight: 500 }}>{mensajeBusqueda}</span>
            </div>
          )}

          {/* Campos para PERSONA JURÍDICA (RNC) */}
          {isPersonaJuridica && (
            <>
              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="razon_social"
                    label="Razón Social"
                    placeholder="Nombre legal de la empresa"
                    value={formDataJuridica.razon_social}
                    onChange={(value) => handleFormJuridicaChange('razon_social', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="nombre_comercial"
                    label="Nombre Comercial"
                    placeholder="Nombre comercial de la empresa"
                    value={formDataJuridica.nombre_comercial}
                    onChange={(value) => handleFormJuridicaChange('nombre_comercial', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="telefono"
                    label="Teléfono"
                    placeholder="809-000-0000"
                    value={formDataJuridica.telefono}
                    onChange={(value) => handleFormJuridicaChange('telefono', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
                <div className="step-form-group">
                  <InputX
                    name="correo"
                    label="Correo Electrónico"
                    placeholder="correo@empresa.com"
                    value={formDataJuridica.correo}
                    onChange={(value) => handleFormJuridicaChange('correo', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [
                        { type: 'required', message: 'Requerido' },
                        { type: 'email', message: 'Email inválido' }
                      ],
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Campos para PERSONA FÍSICA (Cédula, Pasaporte, etc.) */}
          {!isPersonaJuridica && (
            <>
              {/* Clasificación de persona */}
              <div className="step-form-row">
                <div className="step-form-group">
                  <SelectX
                    name="clasificacion"
                    label="Clasificación"
                    placeholder="Seleccione clasificación..."
                    options={[
                      { value: 'EMPLEADO', label: 'Empleado Interno' },
                      { value: 'CONTRATISTA', label: 'Contratista' },
                      { value: 'VISITANTE', label: 'Visitante' },
                    ]}
                    value={clasificacion || undefined}
                    onChange={(value) => {
                      setClasificacion(value as any);
                      // Si deja de ser empleado, limpiar campos relacionados
                      if (value !== 'EMPLEADO') {
                        setCodigoEmpleado('');
                        setDireccionId(null);
                        setDepartamentoId(null);
                      }
                    }}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              {/* Campos básicos de persona física */}
              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="nombre"
                    label="Nombre"
                    placeholder="Primer y segundo nombre"
                    value={formDataFisica.nombre}
                    onChange={(value) => handleFormFisicaChange('nombre', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
                <div className="step-form-group">
                  <InputX
                    name="apellido"
                    label="Apellido"
                    placeholder="Apellidos"
                    value={formDataFisica.apellido}
                    onChange={(value) => handleFormFisicaChange('apellido', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              {/* Campos adicionales si es EMPLEADO */}
              {isEmpleado && (
                <>
                  <div className="step-form-row">
                    <div className="step-form-group">
                      <InputX
                        name="codigo_empleado"
                        label="Código de Empleado"
                        placeholder="Ej: EMP-2024-001"
                        value={codigoEmpleado}
                        onChange={(value) => setCodigoEmpleado(value as string)}
                        disabled={personaEncontrada}
                        rules={{
                          validations: [{ type: 'required', message: 'Requerido para empleados' }],
                        }}
                      />
                    </div>
                  </div>

                  <div className="step-form-row">
                    <div className="step-form-group">
                      <SelectX
                        name="direccion_id"
                        label="Dirección"
                        placeholder="Seleccione dirección..."
                        options={direcciones.map((dir) => ({
                          value: dir.id.toString(),
                          label: dir.nombre,
                        }))}
                        value={direccionId?.toString()}
                        onChange={(value) => {
                          setDireccionId(Number(value));
                          setDepartamentoId(null); // Reset departamento al cambiar dirección
                        }}
                        disabled={personaEncontrada}
                        rules={{
                          validations: [{ type: 'required', message: 'Requerido para empleados' }],
                        }}
                      />
                    </div>
                    <div className="step-form-group">
                      <SelectX
                        name="departamento_id"
                        label="Departamento"
                        placeholder={direccionId ? "Seleccione departamento..." : "Primero seleccione dirección"}
                        options={departamentos.map((dept) => ({
                          value: dept.id.toString(),
                          label: dept.nombre,
                        }))}
                        value={departamentoId?.toString()}
                        onChange={(value) => setDepartamentoId(Number(value))}
                        disabled={!direccionId || personaEncontrada}
                        rules={{
                          validations: [{ type: 'required', message: 'Requerido para empleados' }],
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Campos comunes */}
              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="cargo"
                    label="Cargo"
                    placeholder="Cargo en la institución"
                    value={formDataFisica.cargo}
                    onChange={(value) => handleFormFisicaChange('cargo', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
                <div className="step-form-group">
                  <InputX
                    name="telefono"
                    label="Teléfono"
                    placeholder="809-000-0000"
                    value={formDataFisica.telefono}
                    onChange={(value) => handleFormFisicaChange('telefono', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="correo"
                    label="Correo Electrónico"
                    placeholder="correo@ejemplo.com"
                    value={formDataFisica.correo}
                    onChange={(value) => handleFormFisicaChange('correo', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [
                        { type: 'required', message: 'Requerido' },
                        { type: 'email', message: 'Email inválido' }
                      ],
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Campos adicionales según tipo de salida */}
      {state.persona && (
        <>
          {/* Fecha de devolución para préstamos */}
          {requiresFechaDevolucion() && (
            <div className="step-section">
              <label className="step-label">Fecha de Devolución Esperada</label>
              <InputX
                name="fechaDevolucion"
                type="date"
                value={state.fechaDevolucionEsperada || ''}
                onChange={(value) => handleFechaDevolucionChange(value as string)}
                rules={{
                  validations: [{ type: 'required', message: 'Requerido para préstamos' }],
                }}
              />
            </div>
          )}

          {/* Campos para descargo */}
          {requiresMotivoDescargo() && (
            <>
              <div className="step-section">
                <SelectX
                  name="motivoDescargo"
                  label="Motivo del Descargo"
                  placeholder="Seleccione un motivo..."
                  options={MOTIVOS_DESCARGO.map((m) => ({ value: m.value, label: m.label }))}
                  value={state.motivoDescargo}
                  onChange={(value) => handleMotivoDescargoChange(value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
              <div className="step-section">
                <InputX
                  name="comentarioDescargo"
                  label="Detalles del Descargo"
                  placeholder="Describa los detalles..."
                  value={state.comentarioDescargo || ''}
                  onChange={(value) => handleComentarioDescargoChange(value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
              <div className="step-section">
                <InputX
                  name="documentoAprobacion"
                  label="Documento de Aprobación"
                  placeholder="Ej: RES-2026-003"
                  value={state.documentoAprobacionDescargo || ''}
                  onChange={(value) => handleDocumentoAprobacionChange(value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
            </>
          )}

          {/* Observaciones generales */}
          <div className="step-section">
            <InputX
              name="observaciones"
              label="Observaciones Adicionales"
              placeholder="Observaciones sobre la transacción..."
              value={state.observaciones || ''}
              onChange={(value) => dispatch({ type: 'SET_OBSERVACIONES', payload: value as string })}
              
            />
          </div>
        </>
      )}

      {/* Errores */}
      {state.errors['step_3'] && state.errors['step_3'].length > 0 && (
        <div className="step-errors">
          {state.errors['step_3'].map((error, index) => (
            <p key={index} className="step-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}