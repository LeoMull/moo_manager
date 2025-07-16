package com.mooManager.MooManager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Usuario {

    @Id
    private String email;

    @ManyToOne
    @JoinColumn(name = "cnir", nullable = false)
    private Propriedade propriedade;

    @NotNull
    @Size(max = 11)
    private String cpf;

    @NotNull
    private String senha;

    @NotNull
    private String nome;

    @NotNull
    @Enumerated(EnumType.STRING)
    private NivelAcesso nivelDeAcesso; 

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public Propriedade getPropriedade() {
        return propriedade;
    }

    public void setPropriedade(Propriedade propriedade) {
        this.propriedade = propriedade;
    }

    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public NivelAcesso getNivelDeAcesso() {
        return nivelDeAcesso;
    }
    public void setNivelDeAcesso(NivelAcesso nivelDeAcesso) {
        this.nivelDeAcesso = nivelDeAcesso;
    }
}
