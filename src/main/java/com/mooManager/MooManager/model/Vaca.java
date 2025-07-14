package com.mooManager.MooManager.model;

import java.sql.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Vaca {

    @Id
    private Integer idVaca;

    @ManyToOne
    @JoinColumn(name = "cnir", nullable = false)
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

    private Integer nomePai;

    public Vaca() {}

    public Integer getIdVaca(){
        return idVaca;
    }
    public void setIdVaca(Integer idVaca){
        this.idVaca = idVaca;
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

    public Integer getNomePai() {
        return nomePai;
    }
    public void setNomePai(Integer nomePai) {
        this.nomePai = nomePai;
    }

}

