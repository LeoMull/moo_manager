package com.mooManager.MooManager.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;

import java.sql.Date;;

@Entity
public class Producao {
    @EmbeddedId
    private ProducaoId producaoId;

    @MapsId("cnir")
    @ManyToOne
    @JoinColumn(name = "cnir", nullable = false)
    private Propriedade propriedade;
    
    private double volume;

    public double getVolume() {
        return volume;
    }

    public void setVolume(double volume) {
        this.volume = volume;
    }
    public ProducaoId getProducaoId() {
        return producaoId;
    }
    public void setProducaoId(ProducaoId producaoId) {
        this.producaoId = producaoId;
    }
    public Propriedade getPropriedade() {
        return propriedade;
    }
    public void setPropriedade(Propriedade propriedade) {
        this.propriedade = propriedade;
    }
    public Date getData() {
        return producaoId.getData();
    }
    public void setData(Date data) {
        if (producaoId == null) {
            producaoId = new ProducaoId();
        }
        producaoId.setData(data);

    }
}
