package com.mooManager.MooManager.model;

import java.sql.Date;
import jakarta.persistence.*;

@Entity
public class Inseminacao {
    @EmbeddedId
    private AtendimentoId id;

    @MapsId("vacaId") // mapeia vacaId dentro de AtendimentoId
    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "cnir", referencedColumnName = "cnir"),
        @JoinColumn(name = "id_vaca", referencedColumnName = "id_vaca")
    })
    private Vaca vaca;

    private String pai;
    private String doadora;
    private Date dataInseminacao;
    private String procedimento;

    public Inseminacao() {}
    
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

    public String getPai() {
        return pai;
    }
    public void setPai(String pai) {
        this.pai = pai;
    }

    public String getDoadora() {
        return doadora;
    }
    public void setDoadora(String doadora) {
        this.doadora = doadora;
    }

    public Date getDataInseminacao() {
        return dataInseminacao;
    }
    public void setDataInseminacao(Date dataInseminacao) {
        this.dataInseminacao = dataInseminacao;
    }

    public String getProcedimento() {
        return procedimento;
    }
    public void setProcedimento(String procedimento) {
        this.procedimento = procedimento;
    }
}

