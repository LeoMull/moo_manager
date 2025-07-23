package com.mooManager.MooManager.model;

import java.sql.Date;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Ciclo {
  @EmbeddedId
  private VacaId id;

  @MapsId
  @ManyToOne
  @JoinColumns({
    @JoinColumn(name = "id_vaca", referencedColumnName = "id_vaca"),
    @JoinColumn(name = "cnir", referencedColumnName = "cnir")
  })
  private Vaca vaca;

  private Integer diaAposUltTent;

  private Date primeiroCioCiclo;

  private Date ultCioCiclo;

  private Date primeiraTentaCiclo;

  private Date ultTentativa;

  private Integer paiUltTentativa;

  private Integer doadoraUltTentativa;

    public VacaId getId() {
        return id;
    }

    public void setId(VacaId id) {
        this.id = id;
    }

    public Vaca getVaca() {
        return vaca;
    }

    public void setVaca(Vaca vaca) {
        this.vaca = vaca;
    }

    public Integer getDiaAposUltTent() {
        return diaAposUltTent;
    }

    public void setDiaAposUltTent(Integer diaAposUltTent) {
        this.diaAposUltTent = diaAposUltTent;
    }

    public Date getPrimeiroCioCiclo() {
        return primeiroCioCiclo;
    }

    public void setPrimeiroCioCiclo(Date primeiroCioCiclo) {
        this.primeiroCioCiclo = primeiroCioCiclo;
    }

    public Date getUltCioCiclo() {
        return ultCioCiclo;
    }

    public void setUltCioCiclo(Date ultCioCiclo) {
        this.ultCioCiclo = ultCioCiclo;
    }

    public Date getPrimeiraTentaCiclo() {
        return primeiraTentaCiclo;
    }

    public void setPrimeiraTentaCiclo(Date primeiraTentaCiclo) {
        this.primeiraTentaCiclo = primeiraTentaCiclo;
    }

    public Date getUltTentativa() {
        return ultTentativa;
    }

    public void setUltTentativa(Date ultTentativa) {
        this.ultTentativa = ultTentativa;
    }

    public Integer getPaiUltTentativa() {
        return paiUltTentativa;
    }

    public void setPaiUltTentativa(Integer paiUltTentativa) {
        this.paiUltTentativa = paiUltTentativa;
    }

    public Integer getDoadoraUltTentativa() {
        return doadoraUltTentativa;
    }

    public void setDoadoraUltTentativa(Integer doadoraUltTentativa) {
        this.doadoraUltTentativa = doadoraUltTentativa;
    }
}
