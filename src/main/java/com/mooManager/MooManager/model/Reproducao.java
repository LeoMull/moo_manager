package com.mooManager.MooManager.model;

import java.sql.Date;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Reproducao {
    @EmbeddedId
    private VacaId id;

    @MapsId
    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "id_vaca", referencedColumnName = "id_vaca"),
        @JoinColumn(name = "cnir", referencedColumnName = "cnir")
    })
    private Vaca vaca;

    @Enumerated(EnumType.STRING)
    private TipoParto tipoUltParto; 

    private String situacaoRepo;

    private Integer numPartos;

    private Date prevParto;

    private Integer numTentativas;

    private Date dataUltParto;

    private Integer ultIEP;

    private Integer diaAposParto;

    // SETTERS E GETTERS

    // Situação reprodução
    public String getSituacaoRepo() {
        return situacaoRepo;
    }

    public void setSituacaoRepo(String situacaoRepo) {
        this.situacaoRepo = situacaoRepo;
    }

    // Tipo parto
    public TipoParto getTipoUltParto() {
        return tipoUltParto;
    }
    
    public void setTipoUltParto(TipoParto tipoUltParto) {
        this.tipoUltParto = tipoUltParto;
    }

    // Numero de partos
    public Integer getNumPartos() {
        return numPartos;
    }

    public void setNumPartos(Integer numPartos) {
        this.numPartos = numPartos;
    }

    // Previsão de parto
    public Date getPrevParto() {
        return prevParto;
    }

    public void setPrevParto(Date prevParto) {
        this.prevParto = prevParto;
    }

    // Numero de tentativas
    public Integer getNumTentativas() {
        return numTentativas;
    }

    public void setNumTentativas(Integer numTentativas) {
        this.numTentativas = numTentativas;
    }

    // Data último parto
    public Date getDataUltParto() {
        return dataUltParto;
    }

    public void setDataUltParto(Date dataUltParto) {
        this.dataUltParto = dataUltParto;
    }

    // TODO: Lógicas desses aqui
    public Integer getUltIEP() {
        if (this.dataUltParto == null || this.numPartos == null || this.numPartos < 2) {
            return null;
        }
        long diffMillis = System.currentTimeMillis() - this.dataUltParto.getTime();
        return (int) (diffMillis / (1000 * 60 * 60 * 24));
    }

    public Integer getDiaAposParto() {
        if (this.dataUltParto == null) {
            return null;
        }
        long diffMillis = System.currentTimeMillis() - this.dataUltParto.getTime();
        return (int) (diffMillis / (1000 * 60 * 60 * 24));
    }
}