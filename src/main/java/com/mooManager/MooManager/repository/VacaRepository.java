package com.mooManager.MooManager.repository;

import com.mooManager.MooManager.model.Vaca;
import com.mooManager.MooManager.model.VacaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VacaRepository extends JpaRepository<Vaca, VacaId> {}
