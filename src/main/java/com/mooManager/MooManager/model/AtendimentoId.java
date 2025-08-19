package com.mooManager.MooManager.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AtendimentoId implements Serializable {

    @Column(name = "id_atendimento")
    private Integer idAtendimento;

    @Embedded
    private VacaId vacaId;

    public AtendimentoId() {}

    public AtendimentoId(Integer idAtendimento, VacaId vacaId) {
        this.idAtendimento = idAtendimento;
        this.vacaId = vacaId;
    }

    public Integer getIdAtendimento() {
        return idAtendimento;
    }

    public void setIdAtendimento(Integer idAtendimento) {
        this.idAtendimento = idAtendimento;
    }

    public VacaId getVacaId() {
        return vacaId;
    }

    public void setVacaId(VacaId vacaId) {
        this.vacaId = vacaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AtendimentoId)) return false;
        AtendimentoId that = (AtendimentoId) o;
        return Objects.equals(idAtendimento, that.idAtendimento) &&
               Objects.equals(vacaId, that.vacaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idAtendimento, vacaId);
    }
}
