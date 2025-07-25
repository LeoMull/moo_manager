package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Propriedade;
import com.mooManager.MooManager.repository.PropriedadeRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/propriedades")
public class PropriedadeController {
    private final PropriedadeRepository repo;

    public PropriedadeController(PropriedadeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Propriedade> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Propriedade> buscarPorId(@PathVariable String id) {
        return repo.findById(id).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Propriedade criar(@Valid @RequestBody Propriedade novo) {
        return repo.save(novo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Propriedade> atualizar(@PathVariable String id, @RequestBody Propriedade dados) {
        return repo.findById(id).map(propriedade -> {
            propriedade.setNome(dados.getNome());
            return ResponseEntity.ok(repo.save(propriedade));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        return repo.findById(id).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
    
}
  