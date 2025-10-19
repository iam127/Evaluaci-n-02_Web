package com.hospital.pacientes.service;

import com.hospital.pacientes.entity.AntecedenteMedico;
import com.hospital.pacientes.entity.HistoriaClinica;
import com.hospital.pacientes.repository.AntecedenteMedicoRepository;
import com.hospital.pacientes.repository.HistoriaClinicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AntecedenteMedicoServiceImpl implements AntecedenteMedicoService {

    @Autowired
    private AntecedenteMedicoRepository antecedenteMedicoRepository;

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    @Override
    public List<AntecedenteMedico> listarPorHistoria(Long idHistoria) {
        return antecedenteMedicoRepository.findByHistoriaClinicaIdHistoria(idHistoria);
    }

    @Override
    public List<AntecedenteMedico> listarPorPaciente(Long idPaciente) {
        HistoriaClinica historia = historiaClinicaRepository.findByPacienteIdPaciente(idPaciente)
                .orElseThrow(() -> new RuntimeException("El paciente no tiene historia clínica"));

        return antecedenteMedicoRepository.findByHistoriaClinicaIdHistoria(historia.getIdHistoria());
    }

    @Override
    @Transactional
    public AntecedenteMedico registrar(AntecedenteMedico antecedente) {
        return antecedenteMedicoRepository.save(antecedente);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!antecedenteMedicoRepository.existsById(id)) {
            throw new RuntimeException("Antecedente no encontrado con ID: " + id);
        }
        antecedenteMedicoRepository.deleteById(id);
    }
}