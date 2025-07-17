package com.mooManager.MooManager.repository;

import com.mooManager.MooManager.model.Producao;
import com.mooManager.MooManager.model.ProducaoId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProducaoRepository extends JpaRepository<Producao, ProducaoId> {}
