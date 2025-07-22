package com.mooManager.MooManager.model;

import jakarta.persistence.*;

import java.sql.Date;

public class ProducaoVaca {
    @EmbeddedId
    private VacaId id;

    @MapsId("idVaca")  
    @ManyToOne
    @JoinColumn(name = "idVaca", nullable = false)
    private Vaca vaca;  // ta certo isso?

    @MapsId("cnir")
    @ManyToOne
    @JoinColumn(name = "cnir", nullable = false)
    private Propriedade propriedade;

    private Date dataSecagem;

    private Date dataUltimaSecagem;

    private int qtdLactacoes;

    private Date dataUltimaCtgLeite;

    private float ultimaCtgLeite;

    public Date getDataSecagem() {
        return dataSecagem;
    }

    public void setDataSecagem(Date dataSecagem) {
        this.dataSecagem = dataSecagem;
    }

    public Date getDataUltimaSecagem() {
        return dataUltimaSecagem;
    }

    public void setDataUltimaSecagem(Date dataUltimaSecagem) {
        this.dataUltimaSecagem = dataUltimaSecagem;
    }

    public int getQtdLactacoes() {
        return qtdLactacoes;
    }

    public void setQtdLactacoes(int qtdLactacoes) {
        this.qtdLactacoes = qtdLactacoes;
    }

    public Date getDataUltimaCtgLeite() {
        return dataUltimaCtgLeite;
    }

    public void setDataUltimaCtgLeite(Date dataUltimaCtgLeite) {
        this.dataUltimaCtgLeite = dataUltimaCtgLeite;
    }

    public float getUltimaCtgLeite() {
        return ultimaCtgLeite;
    }

    public void setUltimaCtgLeite(float ultimaCtgLeite) {
        this.ultimaCtgLeite = ultimaCtgLeite;
    }


}
