package com.hospital.pacientes.controller;

import com.hospital.pacientes.entity.Paciente;
import com.hospital.pacientes.entity.HistoriaClinica;
import com.hospital.pacientes.repository.HistoriaClinicaRepository;
import com.hospital.pacientes.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    // 🔹 Inyección del repositorio de historia clínica
    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    @GetMapping
    public ResponseEntity<List<Paciente>> listarTodos() {
        return ResponseEntity.ok(pacienteService.listarTodos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Paciente>> listarActivos() {
        return ResponseEntity.ok(pacienteService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Long id) {
        return pacienteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> registrar(@Valid @RequestBody Paciente paciente) {
        try {
            Paciente pacienteGuardado = pacienteService.registrar(paciente);
            return ResponseEntity.status(HttpStatus.CREATED).body(pacienteGuardado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody Paciente paciente) {
        try {
            Paciente pacienteActualizado = pacienteService.actualizar(id, paciente);
            return ResponseEntity.ok(pacienteActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desactivar(@PathVariable Long id) {
        try {
            pacienteService.desactivar(id);
            return ResponseEntity.ok("Paciente desactivado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 NUEVO ENDPOINT: Obtener historia clínica por ID de paciente
    @GetMapping("/{id}/historia")
    public ResponseEntity<?> obtenerHistoriaClinica(@PathVariable Long id) {
        try {
            HistoriaClinica historia = historiaClinicaRepository.findByPacienteIdPaciente(id)
                    .orElseThrow(() -> new RuntimeException("Historia clínica no encontrada"));
            return ResponseEntity.ok(historia);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
