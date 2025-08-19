package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.*;
import com.mooManager.MooManager.repository.InseminacaoRepository;
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
@RequestMapping("/api/inseminacoes")
public class InseminacaoController {

    private final InseminacaoRepository repo;
    private final VacaRepository vacaRepo;
    private final JwtUtil jwtUtil;

    public InseminacaoController(InseminacaoRepository repo, VacaRepository vacaRepo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.vacaRepo = vacaRepo;
        this.jwtUtil = jwtUtil;
    }

    // Lista todas as inseminações de uma vaca
    @GetMapping("/vaca/{idVaca}")
    public List<Inseminacao> listarPorVaca(
            @PathVariable Integer idVaca,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById_VacaId(vacaId);
    }

    // Busca uma inseminação específica
    @GetMapping("/{idVaca}/{idInseminacao}")
    public ResponseEntity<Inseminacao> buscarPorId(
            @PathVariable Integer idVaca,
            @PathVariable Integer idInseminacao,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        VacaId vacaId = new VacaId(idVaca, cnir);
        AtendimentoId inseminacaoId = new AtendimentoId(idInseminacao, vacaId);

        return repo.findById(inseminacaoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{idVaca}")
    public ResponseEntity<?> create(@RequestBody Inseminacao nova,
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
            AtendimentoId atendimentoId = new AtendimentoId();
            atendimentoId.setIdAtendimento(ultimoId + 1);
            atendimentoId.setVacaId(new VacaId(vaca.getId().getIdVaca(), vaca.getId().getCnir()));

            // Popula a entidade
            nova.setId(atendimentoId);
            nova.setVaca(vaca);

            // Salva
            Inseminacao salva = repo.save(nova);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("erro", "Erro de validação", "mensagem", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Falha interna", "mensagem", e.getMessage()));
        }
    }

    // Atualiza uma inseminação existente
    @PutMapping("/{idVaca}/{idInseminacao}")
    public ResponseEntity<Inseminacao> atualizar(
            @PathVariable Integer idVaca,
            @PathVariable Integer idInseminacao,
            @RequestBody Inseminacao dados,
            @RequestHeader("Authorization") String authHeader) {
                
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        VacaId vacaId = new VacaId(idVaca, cnir);
        AtendimentoId inseminacaoId = new AtendimentoId(idInseminacao, vacaId);

        return repo.findById(inseminacaoId).map(inseminacao -> {
            inseminacao.setPai(dados.getPai());
            inseminacao.setDoadora(dados.getDoadora());
            inseminacao.setDataInseminacao(dados.getDataInseminacao());
            inseminacao.setProcedimento(dados.getProcedimento());
            return ResponseEntity.ok(repo.save(inseminacao));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Deleta uma inseminação
    @DeleteMapping("/{idVaca}/{idInseminacao}")
    public ResponseEntity<Void> deletar(
            @PathVariable Integer idVaca,
            @PathVariable Integer idInseminacao,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        VacaId vacaId = new VacaId(idVaca, cnir);
        AtendimentoId inseminacaoId = new AtendimentoId(idInseminacao, vacaId);

        return repo.findById(inseminacaoId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
