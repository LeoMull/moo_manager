package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Producao;
import com.mooManager.MooManager.model.ProducaoId;
import com.mooManager.MooManager.repository.ProducaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.sql.Date;
import java.time.LocalDate;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/producao")
public class ProducaoController {
    private final ProducaoRepository repo;

    public ProducaoController(ProducaoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Producao> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/{cnir}/{data}")
    public ResponseEntity<Producao> buscarPorId(@PathVariable String cnir, @PathVariable Date data) {
        ProducaoId producaoId = new ProducaoId(cnir, data);
        return repo.findById(producaoId).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Producao criar(@RequestBody Producao novo) {
        return repo.save(novo);
    }

    @PutMapping("/{cnir}/{data}")
    public ResponseEntity<Producao> atualizar(@PathVariable String cnir, @PathVariable LocalDate localDate, @RequestBody Producao dados) {
        Date data = Date.valueOf(localDate);
        ProducaoId producaoId = new ProducaoId(cnir, data);
        return repo.findById(producaoId).map(Producao -> {
            Producao.setVolume(dados.getVolume());
            return ResponseEntity.ok(repo.save(Producao));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("{cnir}/{data}")
    public ResponseEntity<Void> deletar(@PathVariable String cnir, @PathVariable Date data) {
        ProducaoId producaoId = new ProducaoId(cnir, data);
        return repo.findById(producaoId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
  