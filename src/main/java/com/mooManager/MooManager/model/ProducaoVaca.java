package com.mooManager.MooManager.model;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
public class ProducaoVaca {
    @EmbeddedId
    private VacaId id;

    @MapsId
    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "id_vaca", referencedColumnName = "id_vaca"),
        @JoinColumn(name = "cnir", referencedColumnName = "cnir")
    })
    private Vaca vaca;

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

    public void setVaca(Vaca nova){
        this.vaca = nova;
    }

    public VacaId getId() {
        return id;
    }
    public void setId(VacaId id) {
        this.id = id;
    }


}
