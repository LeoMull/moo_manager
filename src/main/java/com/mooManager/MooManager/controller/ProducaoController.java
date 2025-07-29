package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Producao;
import com.mooManager.MooManager.model.ProducaoId;
import com.mooManager.MooManager.repository.ProducaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mooManager.MooManager.security.JwtUtil;

import java.util.List;
import java.sql.Date;
import java.time.LocalDate;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/producao")
public class ProducaoController {
    private final ProducaoRepository repo;
    private final JwtUtil jwtUtil;


    public ProducaoController(ProducaoRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Producao> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/{data}")
    public ResponseEntity<Producao> buscarPorId(@RequestHeader("Authorization") String authHeader, @PathVariable Date data) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        ProducaoId producaoId = new ProducaoId(cnir, data);
        return repo.findById(producaoId).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Producao criar(@RequestBody Producao novo) {
        return repo.save(novo);
    }

    @PutMapping("/{data}")
    public ResponseEntity<Producao> atualizar(@RequestHeader("Authorization") String authHeader, @PathVariable LocalDate localDate, @RequestBody Producao dados) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        Date data = Date.valueOf(localDate);
        ProducaoId producaoId = new ProducaoId(cnir, data);
        return repo.findById(producaoId).map(Producao -> {
            Producao.setVolume(dados.getVolume());
            return ResponseEntity.ok(repo.save(Producao));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{data}")
    public ResponseEntity<Void> deletar(@RequestHeader("Authorization") String authHeader, @PathVariable Date data) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        ProducaoId producaoId = new ProducaoId(cnir, data);
        return repo.findById(producaoId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
  