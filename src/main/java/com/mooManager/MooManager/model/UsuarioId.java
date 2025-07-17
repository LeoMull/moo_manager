package com.mooManager.MooManager.model;

import java.io.Serializable;
import jakarta.persistence.Embeddable;

@Embeddable
public class UsuarioId implements Serializable {
    private String email;
    private String cnir;

    public UsuarioId() {}

    public UsuarioId(String email, String cnir) {
        this.email = email;
        this.cnir = cnir;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
        if (!(o instanceof UsuarioId)) return false;
        UsuarioId that = (UsuarioId) o;
        return email.equals(that.email) && cnir.equals(that.cnir);
    }

    @Override
    public int hashCode() {
        return email.hashCode() + cnir.hashCode();
    }
}
