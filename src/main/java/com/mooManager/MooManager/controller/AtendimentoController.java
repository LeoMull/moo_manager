package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.*;
import com.mooManager.MooManager.repository.AtendimentoRepository;
import com.mooManager.MooManager.repository.VacaRepository;

import com.mooManager.MooManager.security.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/atendimentos")
public class AtendimentoController {

    private final AtendimentoRepository repo;
    private final VacaRepository vacaRepo;
    private final JwtUtil jwtUtil;

    public AtendimentoController(AtendimentoRepository repo, VacaRepository vacaRepo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.vacaRepo = vacaRepo;
        this.jwtUtil = jwtUtil;
    }

    // Lista todos os atendimentos de uma vaca
    @GetMapping("/vaca/{idVaca}")
    public List<Atendimento> listarPorVaca(
            @PathVariable Integer idVaca,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById_VacaId(vacaId);
    }

    // Busca um atendimento específico
    @GetMapping("/{idVaca}/{idAtendimento}")
    public ResponseEntity<Atendimento> buscarPorId(
            @PathVariable Integer idVaca,
            @PathVariable Integer idAtendimento,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        VacaId vacaId = new VacaId(idVaca, cnir);
        AtendimentoId atendimentoId = new AtendimentoId(idAtendimento, vacaId);

        return repo.findById(atendimentoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{idVaca}")
    public ResponseEntity<?> create(@RequestBody Atendimento nova,
                                    @RequestHeader("Authorization") String authHeader,
                                    @PathVariable Integer idVaca) {
        try {
            // Extrai CNIR do token
            String cnir = jwtUtil.getCnirFromToken(authHeader.replace("Bearer ", ""));
            if (cnir == null || cnir.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("erro", "Token inválido", "mensagem", "CNIR não encontrado no token"));
            }

            // Busca a vaca
            Vaca vaca = vacaRepo.findById(new VacaId(idVaca, cnir))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vaca não encontrada"));

            // Gera manualmente o idAtendimento
            Integer ultimoId = repo.findMaxIdAtendimentoByVacaAndCnir(idVaca, cnir);
            System.out.println("Último ID de Atendimento para Vaca " + idVaca + " e CNIR " + cnir + ": " + ultimoId);
            
            AtendimentoId atendimentoId = new AtendimentoId();
            atendimentoId.setIdAtendimento(ultimoId + 1);
            atendimentoId.setVacaId(new VacaId(vaca.getId().getIdVaca(), vaca.getId().getCnir()));

            // Popula a entidade
            nova.setId(atendimentoId);
            nova.setVaca(vaca);

            // Salva
            Atendimento salva = repo.save(nova);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("erro", "Erro de validação", "mensagem", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Falha interna", "mensagem", e.getMessage()));
        }
    }


    // Atualiza um atendimento existente
    @PutMapping("/{idVaca}/{idAtendimento}")
    public ResponseEntity<Atendimento> atualizar(
            @PathVariable Integer idVaca,
            @PathVariable Integer idAtendimento,
            @RequestBody Atendimento dados,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        VacaId vacaId = new VacaId(idVaca, cnir);
        AtendimentoId atendimentoId = new AtendimentoId(idAtendimento, vacaId);

        return repo.findById(atendimentoId).map(atendimento -> {
            atendimento.setMedicamento(dados.getMedicamento());
            atendimento.setDiagnostico(dados.getDiagnostico());
            atendimento.setProcedimento(dados.getProcedimento());
            atendimento.setDataAtendimento(dados.getDataAtendimento());
            return ResponseEntity.ok(repo.save(atendimento));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Deleta um atendimento
    @DeleteMapping("/{idVaca}/{idAtendimento}")
    public ResponseEntity<Void> deletar(
            @PathVariable Integer idVaca,
            @PathVariable Integer idAtendimento,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        VacaId vacaId = new VacaId(idVaca, cnir);
        AtendimentoId atendimentoId = new AtendimentoId(idAtendimento, vacaId);

        return repo.findById(atendimentoId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
