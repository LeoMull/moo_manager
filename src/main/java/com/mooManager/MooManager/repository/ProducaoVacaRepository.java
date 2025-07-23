package com.mooManager.MooManager.repository;

import com.mooManager.MooManager.model.ProducaoVaca;
import com.mooManager.MooManager.model.VacaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProducaoVacaRepository extends JpaRepository<ProducaoVaca, VacaId> {}
    