package com.mooManager.MooManager.repository;

import com.mooManager.MooManager.model.Reproducao;
import com.mooManager.MooManager.model.VacaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ReproducaoRepository extends JpaRepository<Reproducao, VacaId> {}