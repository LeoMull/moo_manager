package com.mooManager.MooManager.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Embeddable
public class LoteId implements Serializable {

    private String cnir;
    private Integer prioridade;

    public LoteId() {}
    public LoteId(String cnir, Integer prioridade) {
        this.cnir = cnir;
        this.prioridade = prioridade;
    }

    public String getCnir() { return cnir; }
    public void setCnir(String cnir) { this.cnir = cnir; }

    public Integer getPrioridade() { return prioridade; }
    public void setPrioridade(Integer prioridade) { this.prioridade = prioridade; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LoteId)) return false;
        LoteId other = (LoteId) o;
        return cnir.equals(other.cnir) && prioridade.equals(other.prioridade);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(cnir, prioridade);
    }
}