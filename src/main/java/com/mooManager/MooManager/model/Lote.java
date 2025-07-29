package com.mooManager.MooManager.model;

import jakarta.persistence.*;

@Entity
public class Lote {
    @EmbeddedId
    private LoteId id;

    @ManyToOne
    @MapsId("cnir") // usa o campo cnir da chave composta como FK
    @JoinColumn(name = "cnir", referencedColumnName = "cnir")
    private Propriedade propriedade;

    private String rotulo;
    private String campo;
    private String operador;
    private String valor;

    public LoteId getId() { return id; }
    public void setId(LoteId id) { this.id = id; }

    public Propriedade getPropriedade() { return propriedade; }
    public void setPropriedade(Propriedade propriedade) { this.propriedade = propriedade; }

    public String getRotulo() { return rotulo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }

    public String getCampo() { return campo; }
    public void setCampo(String campo) { this.campo = campo; }

    public String getOperador() { return operador; }
    public void setOperador(String operador) { this.operador = operador; }

    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }
}
