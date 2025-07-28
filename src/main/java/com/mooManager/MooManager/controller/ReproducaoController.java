package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Reproducao;
import com.mooManager.MooManager.model.Vaca;
import com.mooManager.MooManager.model.VacaId;
import com.mooManager.MooManager.repository.ReproducaoRepository;
import com.mooManager.MooManager.repository.VacaRepository;
import com.mooManager.MooManager.security.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.sql.Date;

@RestController
@RequestMapping("/api/reproducao")
@CrossOrigin(origins = "*")
public class ReproducaoController {

    // Para usar os métodos do repository para SQL
    private final ReproducaoRepository repo; 
    private final VacaRepository vacaRepo;
    private final JwtUtil jwtUtil;

    public ReproducaoController(ReproducaoRepository repo, VacaRepository vacaRepo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.vacaRepo = vacaRepo;
        this.jwtUtil = jwtUtil;
    }

    // Métodos HTTP

    @GetMapping // Root
    public List<Reproducao> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/{idVaca}") // Busca a reproducação de uma vaca pela chave composta de cnir + idVaca
    public ResponseEntity<Reproducao> buscarPorId(@PathVariable Integer idVaca, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId reproducaoId = new VacaId(idVaca, cnir);
        return repo.findById(reproducaoId).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{idVaca}/dias-apos-parto") // Usa o getDiaAposParto do model da reprodução
    public ResponseEntity<Integer> getDiaAposParto(@RequestHeader("Authorization") String authHeader, @PathVariable Integer idVaca) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);    
        VacaId reproducaoId = new VacaId(idVaca, cnir);
        return repo.findById(reproducaoId).map(reproducao -> {
            Integer dias = reproducao.getDiaAposParto();
            return ResponseEntity.ok(dias);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{idVaca}")
    public Reproducao criar(@RequestBody Reproducao novo, @RequestHeader("Authorization") String authHeader, @PathVariable Integer idVaca) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId vacaId = new VacaId(idVaca, cnir);
        Vaca vaca = vacaRepo.findById(vacaId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND));
        System.out.println("Vaca encontrada: " + vaca);
        novo.setVaca(vaca);
        return repo.save(novo);
    }

    @PutMapping("/{idVaca}") 
    public ResponseEntity<Reproducao> atualizarOuCriar(@PathVariable Integer idVaca, @RequestHeader("Authorization") String authHeader, @RequestBody Reproducao dados) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId vacaId = new VacaId(idVaca, cnir);

        return repo.findById(vacaId).map(repro -> {
            repro.setSituacaoRepo(dados.getSituacaoRepo());
            repro.setTipoUltParto(dados.getTipoUltParto());
            repro.setNumPartos(dados.getNumPartos());
            repro.setPrevParto(dados.getPrevParto());
            repro.setNumTentativas(dados.getNumTentativas());
            repro.setDataUltParto(dados.getDataUltParto());
            return ResponseEntity.ok(repo.save(repro));
        }).orElseGet(() -> {
            // Cria uma referência à vaca associada
            Vaca vaca = vacaRepo.findById(vacaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vaca não encontrada"));

            dados.setId(vacaId);
            dados.setVaca(vaca); // IMPORTANTE: associar a vaca

            return ResponseEntity.ok(repo.save(dados));
        });
    }


    
    @DeleteMapping("/{idVaca}")
    public ResponseEntity<Void> deletar(@PathVariable Integer idVaca, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);    
        VacaId reproducaoId = new VacaId(idVaca, cnir);
        return repo.findById(reproducaoId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
