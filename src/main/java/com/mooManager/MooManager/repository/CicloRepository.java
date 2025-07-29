package com.mooManager.MooManager.repository;

import com.mooManager.MooManager.model.Ciclo;
import com.mooManager.MooManager.model.VacaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CicloRepository extends JpaRepository<Ciclo, VacaId> {}
