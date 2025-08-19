package com.mooManager.MooManager.model;

import java.sql.Date;
import jakarta.persistence.*;

@Entity
public class Atendimento {
    @EmbeddedId
    private AtendimentoId id;

    @MapsId("vacaId") // mapeia vacaId dentro de AtendimentoId
    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "cnir", referencedColumnName = "cnir"),
        @JoinColumn(name = "id_vaca", referencedColumnName = "id_vaca")
    })
    private Vaca vaca;

    private String medicamento;

    private String diagnostico;

    private String procedimento;

    private Date dataAtendimento;

    public Atendimento() {}

    public AtendimentoId getId() {
        return id;
    }  
    public void setId(AtendimentoId id) {
        this.id = id;
    }

    public Vaca getVaca() {
        return vaca;
    }

    public void setVaca(Vaca vaca) {
        this.vaca = vaca;
    }

    public String getMedicamento() {
        return medicamento;
    }
    public void setMedicamento(String medicamento) {
        this.medicamento = medicamento;
    }

    public String getDiagnostico() {
        return diagnostico;
    }
    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getProcedimento() {
        return procedimento;
    }
    public void setProcedimento(String procedimento) {
        this.procedimento = procedimento;
    }

    public Date getDataAtendimento() {
        return dataAtendimento;
    }

    public void setDataAtendimento(Date dataAtendimento) {
        this.dataAtendimento = dataAtendimento;
    }
}

