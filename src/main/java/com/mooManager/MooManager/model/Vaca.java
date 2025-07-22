package com.mooManager.MooManager.model;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Vaca {
    @EmbeddedId
    @AttributeOverrides({
        @AttributeOverride(name = "idVaca", column = @Column(name = "id_vaca")),
        @AttributeOverride(name = "cnir", column = @Column(name = "cnir"))
    })
    private VacaId id;

    @ManyToOne
    @JoinColumn(name = "cnir", referencedColumnName = "cnir", insertable = false, updatable = false)
    private Propriedade propriedade;

    @NotNull
    @Size(max = 1)
    private String sexo;

    @NotNull
    private String raca;

    @NotNull
    private Date dataNasc;

    @NotNull
    private String categoria; 

    private String lote;

    @NotNull
    private Boolean precisaAtendimento;

    private String observacao;

    private Float peso;

    private Date dataUltimaPesagem;

    private Integer idMae;

    private String nomeMae;

    private Integer idPai;

    private String nomePai;

    public Vaca() {}

    public VacaId getId() {
        return id;
    }

    public void setId(VacaId id) {
        this.id = id;
    }

    public Propriedade getPropriedade() {
        return propriedade;
    }

    public void setPropriedade(Propriedade propriedade) {
        this.propriedade = propriedade;
    }

    public String getSexo(){
        return sexo;
    }    
    public void setSexo(String sexo){
     this.sexo = sexo;
    }

    public String getRaca(){
        return raca;
    }
    public void setRaca(String raca){
        this.raca = raca;
    }

    public Date getDataNasc(){
        return dataNasc;
    }
    public void setDataNasc(Date dataNasc){
        this.dataNasc = dataNasc;
    }

    public String getCategoria(){
        return categoria;
    }
    public void setCategoria(String categoria){
        this.categoria = categoria;
    }

    public String getLote(){
        return lote;
    }
    public void setLote(String lote){
        this.lote = lote;
    }
    
    public Boolean getPrecisaAtendimento(){
        return precisaAtendimento;
    }
    public void setPrecisaAtendimento(Boolean precisaAtendimento){
        this.precisaAtendimento = precisaAtendimento;
    }

    public String getObservacao(){
        return observacao;
    }
    public void setObservacao(String observacao){
        this.observacao = observacao;
    }

    public Float getPeso(){
        return peso;
    }
    public void setPeso(Float peso){
        this.peso = peso;
    }

    public Date getDataUltimaPesagem(){
        return dataUltimaPesagem;
    }
    public void setDataUltimaPesagem(Date dataUltimaPesagem){
        this.dataUltimaPesagem = dataUltimaPesagem;
    }

    public Integer getIdMae() {
        return idMae;
    }
    public void setIdMae(Integer idMae) {
        this.idMae = idMae;
    }

    public String getNomeMae() {
        return nomeMae;
    }
    public void setNomeMae(String nomeMae) {
        this.nomeMae = nomeMae;
    }

    public Integer getIdPai() {
        return idPai;
    }
    public void setIdPai(Integer idPai) {
        this.idPai = idPai;
    }

    public String getNomePai() {
        return nomePai;
    }
    public void setNomePai(String nomePai) {
        this.nomePai = nomePai;
    }

}

