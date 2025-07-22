package com.mooManager.MooManager.model;

import java.io.Serializable;
import java.util.Objects;


import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;

@Embeddable
public class VacaId implements Serializable {
    @Column(name = "cnir")
    private String cnir;

    @Column(name = "id_vaca")
    private Integer idVaca;

    public VacaId() {}

    public VacaId(Integer idVaca, String cnir) {
        this.idVaca = idVaca;
        this.cnir = cnir;
    }

    public Integer getIdVaca() {
        return idVaca;
    }

    public void setIdVaca(Integer idVaca) {
        this.idVaca = idVaca;
    }

    public String getCnir() {
        return cnir;
    }

    public void setCnir(String cnir) {
        this.cnir = cnir;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof VacaId)) return false;
        VacaId vacaId = (VacaId) o;
        return Objects.equals(idVaca, vacaId.idVaca) &&
               Objects.equals(cnir, vacaId.cnir);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idVaca, cnir);
    }
}
