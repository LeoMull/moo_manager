package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Propriedade;
import com.mooManager.MooManager.repository.PropriedadeRepository;
import com.mooManager.MooManager.security.JwtUtil;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/propriedades")
public class PropriedadeController {
    private final PropriedadeRepository repo;
    private final JwtUtil jwtUtil;

    public PropriedadeController(PropriedadeRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Propriedade> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/current")
    public ResponseEntity<Propriedade> buscarPorId(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String id = jwtUtil.getCnirFromToken(token);
        return repo.findById(id).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Propriedade criar(@Valid @RequestBody Propriedade novo) {
        return repo.save(novo);
    }

    @PutMapping("/current")
    public ResponseEntity<Propriedade> atualizar(@RequestHeader("Authorization") String authHeader, @RequestBody Propriedade dados) {
        String token = authHeader.replace("Bearer ", "");
        String id = jwtUtil.getCnirFromToken(token);
        return repo.findById(id).map(propriedade -> {
            propriedade.setNome(dados.getNome());
            return ResponseEntity.ok(repo.save(propriedade));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/current")
    public ResponseEntity<Void> deletar(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String id = jwtUtil.getCnirFromToken(token);
        return repo.findById(id).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
    
}
  