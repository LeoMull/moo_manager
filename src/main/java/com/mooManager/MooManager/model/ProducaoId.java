package com.mooManager.MooManager.model;

import java.sql.Date;

public class ProducaoId {
    private Date data;
    private String cnir;

    public ProducaoId() {}

    public ProducaoId(String cnir, Date data) {
        this.cnir = cnir;
        this.data = data;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getCnir() {
        return cnir;
    }

    public void setCnir(String cnir) {
        this.cnir = cnir;
    }
}
