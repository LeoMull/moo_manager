package com.mooManager.MooManager.repository;

import com.mooManager.MooManager.model.Vaca;
import com.mooManager.MooManager.model.VacaId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VacaRepository extends JpaRepository<Vaca, VacaId> {
    List<Vaca> findAllByIdCnir(String cnir);
}
