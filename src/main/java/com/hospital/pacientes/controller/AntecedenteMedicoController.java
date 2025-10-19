package com.hospital.pacientes.controller;

import com.hospital.pacientes.entity.AntecedenteMedico;
import com.hospital.pacientes.service.AntecedenteMedicoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/antecedentes")
@CrossOrigin(origins = "*")
public class AntecedenteMedicoController {

    @Autowired
    private AntecedenteMedicoService antecedenteMedicoService;

    @GetMapping("/historia/{idHistoria}")
    public ResponseEntity<List<AntecedenteMedico>> listarPorHistoria(@PathVariable Long idHistoria) {
        return ResponseEntity.ok(antecedenteMedicoService.listarPorHistoria(idHistoria));
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<AntecedenteMedico>> listarPorPaciente(@PathVariable Long idPaciente) {
        return ResponseEntity.ok(antecedenteMedicoService.listarPorPaciente(idPaciente));
    }

    @PostMapping
    public ResponseEntity<?> registrar(@Valid @RequestBody AntecedenteMedico antecedente) {
        try {
            AntecedenteMedico antecedentGuardado = antecedenteMedicoService.registrar(antecedente);
            return ResponseEntity.status(HttpStatus.CREATED).body(antecedentGuardado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            antecedenteMedicoService.eliminar(id);
            return ResponseEntity.ok("Antecedente eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}