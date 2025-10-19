package com.hospital.pacientes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "antecedente_medico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AntecedenteMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAntecedente;

    @ManyToOne
    @JoinColumn(name = "id_historia", nullable = false)
    @JsonIgnoreProperties({"paciente", "hibernateLazyInitializer", "handler"})
    private HistoriaClinica historiaClinica;

    @NotBlank(message = "El tipo es obligatorio")
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String tipo; // alergias, enfermedades previas, cirugías

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 500)
    @Column(nullable = false, length = 500)
    private String descripcion;
}