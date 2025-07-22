package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Reproducao;
import com.mooManager.MooManager.model.VacaId;
import com.mooManager.MooManager.repository.ReproducaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.sql.Date;

@RestController
@RequestMapping("/api/reproducao")
@CrossOrigin(origins = "*")
public class ReproducaoController {

    // Para usar os métodos do repository para SQL
    private final ReproducaoRepository repo; 

    public ReproducaoController(ReproducaoRepository repo) {
        this.repo = repo;
    }

    // Métodos HTTP

    @GetMapping // Root
    public List<Reproducao> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/{cnir}/{idVaca}") // Busca a reproducação de uma vaca pela chave composta de cnir + idVaca
    public ResponseEntity<Reproducao> buscarPorId(@PathVariable String cnir, @PathVariable Integer idVaca) {
        VacaId reproducaoId = new VacaId(idVaca, cnir);
        return repo.findById(reproducaoId).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping // coloca uma nova reproducação
    public Reproducao criar(@RequestBody Reproducao novo) {
        return repo.save(novo);
    }

    @PutMapping("/{cnir}/{idVaca}") 
    public ResponseEntity<Reproducao> atualizar(@PathVariable Integer idVaca, @PathVariable String cnir, @RequestBody Reproducao dados) {
        VacaId reproducaoId = new VacaId(idVaca, cnir);
        return repo.findById(reproducaoId).map(repro -> {
            repro.setSituacaoRepo(dados.getSituacaoRepo());
            repro.setTipoUltParto(dados.getTipoUltParto());
            repro.setNumPartos(dados.getNumPartos());
            repro.setPrevParto(dados.getPrevParto());
            repro.setNumTentativas(dados.getNumTentativas());
            repro.setDataUltParto(dados.getDataUltParto());
            return ResponseEntity.ok(repo.save(repro));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{cnir}/{idVaca}")
    public ResponseEntity<Void> deletar(@PathVariable Integer idVaca, @PathVariable String cnir) {
        VacaId reproducaoId = new VacaId(idVaca, cnir);
        return repo.findById(reproducaoId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
