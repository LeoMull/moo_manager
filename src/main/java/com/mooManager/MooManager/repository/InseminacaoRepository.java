package com.mooManager.MooManager.repository;

import com.mooManager.MooManager.model.Inseminacao;
import com.mooManager.MooManager.model.AtendimentoId;
import com.mooManager.MooManager.model.VacaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InseminacaoRepository extends JpaRepository<Inseminacao, AtendimentoId> {

    // Busca todos os atendimentos de uma vaca específica pelo VacaId
    List<Inseminacao> findById_VacaId(VacaId vacaId);

    // Alternativa: busca usando as duas partes separadas do VacaId
    List<Inseminacao> findById_VacaId_CnirAndId_VacaId_IdVaca(String cnir, Integer idVaca);

    @Query("SELECT COALESCE(MAX(a.id.idAtendimento), 0) FROM Inseminacao a WHERE a.id.vacaId.idVaca = :idVaca AND a.id.vacaId.cnir = :cnir")
    Integer findMaxIdAtendimentoByVacaAndCnir(@Param("idVaca") Integer idVaca,
                                            @Param("cnir") String cnir);
}
