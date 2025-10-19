package com.hospital.pacientes.service;

import com.hospital.pacientes.entity.Paciente;
import com.hospital.pacientes.entity.HistoriaClinica;
import com.hospital.pacientes.repository.PacienteRepository;
import com.hospital.pacientes.repository.HistoriaClinicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PacienteServiceImpl implements PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    @Override
    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    @Override
    public Optional<Paciente> buscarPorId(Long id) {
        return pacienteRepository.findById(id);
    }

    @Override
    @Transactional
    public Paciente registrar(Paciente paciente) {
        // Validar que no exista el DNI
        if (pacienteRepository.existsByDni(paciente.getDni())) {
            throw new RuntimeException("Ya existe un paciente con el DNI: " + paciente.getDni());
        }

        // Validar que no exista el correo
        if (pacienteRepository.existsByCorreo(paciente.getCorreo())) {
            throw new RuntimeException("Ya existe un paciente con el correo: " + paciente.getCorreo());
        }

        // Guardar paciente
        Paciente pacienteGuardado = pacienteRepository.save(paciente);

        // Crear historia clínica automáticamente
        HistoriaClinica historia = new HistoriaClinica();
        historia.setPaciente(pacienteGuardado);
        historia.setFechaApertura(LocalDate.now());
        historia.setObservaciones("Historia clínica creada automáticamente");
        historiaClinicaRepository.save(historia);

        return pacienteGuardado;
    }

    @Override
    @Transactional
    public Paciente actualizar(Long id, Paciente paciente) {
        Paciente pacienteExistente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + id));

        // Validar DNI si cambió
        if (!pacienteExistente.getDni().equals(paciente.getDni())) {
            if (pacienteRepository.existsByDni(paciente.getDni())) {
                throw new RuntimeException("Ya existe un paciente con el DNI: " + paciente.getDni());
            }
        }

        // Validar correo si cambió
        if (!pacienteExistente.getCorreo().equals(paciente.getCorreo())) {
            if (pacienteRepository.existsByCorreo(paciente.getCorreo())) {
                throw new RuntimeException("Ya existe un paciente con el correo: " + paciente.getCorreo());
            }
        }

        // Actualizar campos
        pacienteExistente.setDni(paciente.getDni());
        pacienteExistente.setNombres(paciente.getNombres());
        pacienteExistente.setApellidos(paciente.getApellidos());
        pacienteExistente.setFechaNacimiento(paciente.getFechaNacimiento());
        pacienteExistente.setSexo(paciente.getSexo());
        pacienteExistente.setDireccion(paciente.getDireccion());
        pacienteExistente.setTelefono(paciente.getTelefono());
        pacienteExistente.setCorreo(paciente.getCorreo());

        return pacienteRepository.save(pacienteExistente);
    }

    @Override
    @Transactional
    public void desactivar(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + id));

        paciente.setEstado("inactivo");
        pacienteRepository.save(paciente);
    }

    @Override
    public List<Paciente> listarActivos() {
        return pacienteRepository.findByEstado("activo");
    }
}