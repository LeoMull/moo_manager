package com.mooManager.MooManager.model;

import jakarta.persistence.*;
import java.util.List;


@Entity
public class Propriedade {

    @Id
    private String cnir;
    private String nome;

    @OneToMany(mappedBy = "propriedade")
    private List<Usuario> usuarios;

    public Propriedade() {}

    public Propriedade(String cnir, String nome) {
        this.cnir = cnir;
        this.nome = nome;
    }

    // Getters e Setters
    public String getCnir() { return cnir; }
    public void setCnir(String cnir) { this.cnir = cnir; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

}