package com.hospital.pacientes.repository;

import com.hospital.pacientes.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByDni(String dni);

    Optional<Paciente> findByCorreo(String correo);

    List<Paciente> findByEstado(String estado);

    boolean existsByDni(String dni);

    boolean existsByCorreo(String correo);
}