package com.hospital.pacientes.service;

import com.hospital.pacientes.entity.Paciente;

import java.util.List;
import java.util.Optional;

public interface PacienteService {
    List<Paciente> listarTodos();

    Optional<Paciente> buscarPorId(Long id);

    Paciente registrar(Paciente paciente);

    Paciente actualizar(Long id, Paciente paciente);

    void desactivar(Long id);

    List<Paciente> listarActivos();
}