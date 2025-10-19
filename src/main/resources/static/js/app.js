// API Base URL
const API_URL = 'http://localhost:8080/api/pacientes';
const API_ANTECEDENTES = 'http://localhost:8080/api/antecedentes';

// Variables globales
let pacientes = [];
let pacienteEditando = null;
let filtroActual = 'todos';
let pacienteActualAntecedentes = null;

// Elementos del DOM
const pacienteForm = document.getElementById('pacienteForm');
const formTitle = document.getElementById('formTitle');
const btnCancelar = document.getElementById('btnCancelar');
const tbodyPacientes = document.getElementById('tbodyPacientes');
const modalConfirm = document.getElementById('modalConfirm');
const modalMessage = document.getElementById('modalMessage');
const btnConfirmar = document.getElementById('btnConfirmar');
const btnCancelarModal = document.getElementById('btnCancelarModal');
const modalAntecedentes = document.getElementById('modalAntecedentes');
const antecedenteForm = document.getElementById('antecedenteForm');

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarPacientes();
    configurarEventos();
    establecerFechaMaxima();
});

// Configurar eventos
function configurarEventos() {
    pacienteForm.addEventListener('submit', guardarPaciente);
    btnCancelar.addEventListener('click', cancelarEdicion);
    btnCancelarModal.addEventListener('click', cerrarModal);
    antecedenteForm.addEventListener('submit', guardarAntecedente);
}

// Establecer fecha máxima (hoy) para fecha de nacimiento
function establecerFechaMaxima() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaNacimiento').setAttribute('max', hoy);
}

// Cargar pacientes desde la API
async function cargarPacientes() {
    try {
        mostrarCargando();
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Error al cargar pacientes');
        }

        pacientes = await response.json();
        mostrarPacientes();
    } catch (error) {
        console.error('Error:', error);
        mostrarError('No se pudieron cargar los pacientes');
    }
}

// Mostrar pacientes en la tabla
function mostrarPacientes() {
    let pacientesFiltrados = pacientes;

    // Aplicar filtro
    if (filtroActual === 'activos') {
        pacientesFiltrados = pacientes.filter(p => p.estado === 'activo');
    } else if (filtroActual === 'inactivos') {
        pacientesFiltrados = pacientes.filter(p => p.estado === 'inactivo');
    }

    if (pacientesFiltrados.length === 0) {
        tbodyPacientes.innerHTML = `
            <tr>
                <td colspan="9" class="loading">No hay pacientes registrados</td>
            </tr>
        `;
        return;
    }

    tbodyPacientes.innerHTML = pacientesFiltrados.map(paciente => `
        <tr>
            <td>${paciente.idPaciente}</td>
            <td>${paciente.dni}</td>
            <td>${paciente.nombres} ${paciente.apellidos}</td>
            <td>${formatearFecha(paciente.fechaNacimiento)}</td>
            <td>${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</td>
            <td>${paciente.telefono}</td>
            <td>${paciente.correo}</td>
            <td>
                <span class="badge ${paciente.estado === 'activo' ? 'badge-success' : 'badge-danger'}">
                    ${paciente.estado.toUpperCase()}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-info btn-sm" onclick="abrirAntecedentes(${paciente.idPaciente})" title="Antecedentes">
                        📋
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editarPaciente(${paciente.idPaciente})" title="Editar">
                        ✏️
                    </button>
                    ${paciente.estado === 'activo' ? `
                        <button class="btn btn-danger btn-sm" onclick="confirmarDesactivar(${paciente.idPaciente})" title="Desactivar">
                            🗑️
                        </button>
                    ` : `
                        <button class="btn btn-success btn-sm" onclick="activarPaciente(${paciente.idPaciente})" title="Activar">
                            ✅
                        </button>
                    `}
                </div>
            </td>
        </tr>
    `).join('');
}

// Guardar paciente (crear o actualizar)
async function guardarPaciente(e) {
    e.preventDefault();

    const paciente = {
        dni: document.getElementById('dni').value.trim(),
        nombres: document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        sexo: document.getElementById('sexo').value,
        direccion: document.getElementById('direccion').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        estado: 'activo'
    };

    try {
        let response;

        if (pacienteEditando) {
            // Actualizar
            response = await fetch(`${API_URL}/${pacienteEditando}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paciente)
            });
        } else {
            // Crear
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paciente)
            });
        }

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        mostrarExito(pacienteEditando ? 'Paciente actualizado correctamente' : 'Paciente registrado correctamente');
        cancelarEdicion();
        cargarPacientes();

    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
    }
}

// Editar paciente
function editarPaciente(id) {
    const paciente = pacientes.find(p => p.idPaciente === id);

    if (!paciente) return;

    pacienteEditando = id;
    formTitle.textContent = 'Editar Paciente';

    document.getElementById('idPaciente').value = paciente.idPaciente;
    document.getElementById('dni').value = paciente.dni;
    document.getElementById('nombres').value = paciente.nombres;
    document.getElementById('apellidos').value = paciente.apellidos;
    document.getElementById('fechaNacimiento').value = paciente.fechaNacimiento;
    document.getElementById('sexo').value = paciente.sexo;
    document.getElementById('direccion').value = paciente.direccion;
    document.getElementById('telefono').value = paciente.telefono;
    document.getElementById('correo').value = paciente.correo;

    document.getElementById('btnGuardar').textContent = '💾 Actualizar Paciente';

    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cancelar edición
function cancelarEdicion() {
    pacienteEditando = null;
    pacienteForm.reset();
    formTitle.textContent = 'Registrar Nuevo Paciente';
    document.getElementById('btnGuardar').textContent = '💾 Guardar Paciente';
}

// Confirmar desactivar
function confirmarDesactivar(id) {
    const paciente = pacientes.find(p => p.idPaciente === id);
    modalMessage.textContent = `¿Está seguro de desactivar al paciente ${paciente.nombres} ${paciente.apellidos}?`;

    btnConfirmar.onclick = () => desactivarPaciente(id);

    modalConfirm.classList.add('show');
}

// Desactivar paciente
async function desactivarPaciente(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al desactivar paciente');
        }

        mostrarExito('Paciente desactivado correctamente');
        cerrarModal();
        cargarPacientes();

    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
    }
}

// Activar paciente
async function activarPaciente(id) {
    const paciente = pacientes.find(p => p.idPaciente === id);
    paciente.estado = 'activo';

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paciente)
        });

        if (!response.ok) {
            throw new Error('Error al activar paciente');
        }
        mostrarExito('Paciente activado correctamente');
        cargarPacientes();

    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
    }
}

// Filtrar pacientes
function filtrarPacientes(filtro) {
    filtroActual = filtro;

    // Actualizar botones activos
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    mostrarPacientes();
}

// =====================================================
// GESTIÓN DE ANTECEDENTES MÉDICOS
// =====================================================

// Abrir modal de antecedentes
async function abrirAntecedentes(idPaciente) {
    const paciente = pacientes.find(p => p.idPaciente === idPaciente);

    if (!paciente) {
        mostrarError('Paciente no encontrado');
        return;
    }

    pacienteActualAntecedentes = paciente;

    // Mostrar información del paciente
    document.getElementById('pacienteInfo').innerHTML = `
        <h4>👤 ${paciente.nombres} ${paciente.apellidos}</h4>
        <p><strong>DNI:</strong> ${paciente.dni} | <strong>Edad:</strong> ${calcularEdad(paciente.fechaNacimiento)} años</p>
    `;

    // Obtener historia clínica
    try {
        const response = await fetch(`${API_URL}/${idPaciente}/historia`);

        if (!response.ok) {
            throw new Error('No se pudo obtener la historia clínica');
        }

        const historia = await response.json();
        document.getElementById('idHistoriaAntecedente').value = historia.idHistoria;

        // Cargar antecedentes
        await cargarAntecedentes(idPaciente);

    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
    }

    // Mostrar modal
    modalAntecedentes.classList.add('show');
}

// Cargar antecedentes del paciente
async function cargarAntecedentes(idPaciente) {
    const listaAntecedentes = document.getElementById('listaAntecedentes');
    listaAntecedentes.innerHTML = '<div class="loading">Cargando antecedentes...</div>';

    try {
        const response = await fetch(`${API_ANTECEDENTES}/paciente/${idPaciente}`);

        if (!response.ok) {
            throw new Error('Error al cargar antecedentes');
        }

        const antecedentes = await response.json();

        if (antecedentes.length === 0) {
            listaAntecedentes.innerHTML = `
                <div class="sin-antecedentes">
                    <p>📋 No hay antecedentes médicos registrados</p>
                    <p>Utilice el formulario superior para agregar el primer antecedente.</p>
                </div>
            `;
            return;
        }

        listaAntecedentes.innerHTML = antecedentes.map(ant => `
            <div class="antecedente-item">
                <div class="antecedente-content">
                    <span class="antecedente-tipo">${ant.tipo}</span>
                    <p class="antecedente-descripcion">${ant.descripcion}</p>
                </div>
                <div class="antecedente-actions">
                    <button class="btn btn-danger btn-sm" onclick="confirmarEliminarAntecedente(${ant.idAntecedente})" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        listaAntecedentes.innerHTML = `
            <div class="sin-antecedentes">
                <p style="color: #dc3545;">❌ Error al cargar antecedentes</p>
            </div>
        `;
    }
}

// Guardar antecedente
async function guardarAntecedente(e) {
    e.preventDefault();

    const idHistoria = document.getElementById('idHistoriaAntecedente').value;
    const tipo = document.getElementById('tipoAntecedente').value;
    const descripcion = document.getElementById('descripcionAntecedente').value.trim();

    if (!idHistoria) {
        mostrarError('No se encontró la historia clínica');
        return;
    }

    const antecedente = {
        historiaClinica: {
            idHistoria: parseInt(idHistoria)
        },
        tipo: tipo,
        descripcion: descripcion
    };

    try {
        const response = await fetch(API_ANTECEDENTES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(antecedente)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        mostrarExito('Antecedente agregado correctamente');
        antecedenteForm.reset();

        // Recargar antecedentes
        await cargarAntecedentes(pacienteActualAntecedentes.idPaciente);

    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
    }
}

// Confirmar eliminar antecedente
function confirmarEliminarAntecedente(idAntecedente) {
    modalMessage.textContent = '¿Está seguro de eliminar este antecedente médico?';

    btnConfirmar.onclick = () => eliminarAntecedente(idAntecedente);

    modalConfirm.classList.add('show');
}

// Eliminar antecedente
async function eliminarAntecedente(idAntecedente) {
    try {
        const response = await fetch(`${API_ANTECEDENTES}/${idAntecedente}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar antecedente');
        }

        mostrarExito('Antecedente eliminado correctamente');
        cerrarModal();

        // Recargar antecedentes
        await cargarAntecedentes(pacienteActualAntecedentes.idPaciente);

    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
    }
}

// Cerrar modal de antecedentes
function cerrarModalAntecedentes() {
    modalAntecedentes.classList.remove('show');
    antecedenteForm.reset();
    pacienteActualAntecedentes = null;
}

// Cerrar modal de confirmación
function cerrarModal() {
    modalConfirm.classList.remove('show');
}

// =====================================================
// UTILIDADES
// =====================================================

function formatearFecha(fecha) {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad;
}

function mostrarCargando() {
    tbodyPacientes.innerHTML = `
        <tr>
            <td colspan="9" class="loading">Cargando pacientes...</td>
        </tr>
    `;
}

function mostrarExito(mensaje) {
    alert('✅ ' + mensaje);
}

function mostrarError(mensaje) {
    alert('❌ ' + mensaje);
}