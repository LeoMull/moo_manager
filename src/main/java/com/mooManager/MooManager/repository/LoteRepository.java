package com.mooManager.MooManager.repository;

import com.mooManager.MooManager.model.Lote;
import com.mooManager.MooManager.model.LoteId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoteRepository extends JpaRepository<Lote, LoteId> {
    List<Lote> findByIdCnir(String cnir);
}
