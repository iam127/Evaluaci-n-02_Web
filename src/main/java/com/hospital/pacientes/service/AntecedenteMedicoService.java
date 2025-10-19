package com.hospital.pacientes.service;

import com.hospital.pacientes.entity.AntecedenteMedico;
import java.util.List;

public interface AntecedenteMedicoService {
    List<AntecedenteMedico> listarPorHistoria(Long idHistoria);
    List<AntecedenteMedico> listarPorPaciente(Long idPaciente);
    AntecedenteMedico registrar(AntecedenteMedico antecedente);
    void eliminar(Long id);
}