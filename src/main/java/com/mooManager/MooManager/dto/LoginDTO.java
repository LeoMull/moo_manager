package com.mooManager.MooManager.dto;

public class LoginDTO {
    private String email;
    private String senha;
    private String cnir;

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCnir() {
        return cnir;
    }

    public void setCnir(String cnir) {
        this.cnir = cnir;
    }
}
