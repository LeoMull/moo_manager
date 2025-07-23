package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.ProducaoVaca;
import com.mooManager.MooManager.model.VacaId;
import com.mooManager.MooManager.repository.ProducaoVacaRepository;
import com.mooManager.MooManager.repository.VacaRepository;
import com.mooManager.MooManager.security.JwtUtil;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.mooManager.MooManager.model.Vaca;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/producao_vaca")
public class ProducaoVacaController {

    private final ProducaoVacaRepository repo;
    private final VacaRepository vacaRepo;
    private final JwtUtil jwtUtil;
    
    public ProducaoVacaController(ProducaoVacaRepository repo, VacaRepository vacaRepo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.vacaRepo = vacaRepo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<ProducaoVaca> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/{cnir}/{idVaca}")
    public ResponseEntity<ProducaoVaca> buscarPorChave(@PathVariable String cnir, @PathVariable int idVaca) {
        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{cnir}/{idVaca}")
    public ProducaoVaca criar(@RequestBody ProducaoVaca novo, @PathVariable String cnir, @PathVariable int idVaca) {
        VacaId vacaId = new VacaId(idVaca, cnir);
        Vaca vaca = vacaRepo.findById(vacaId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND));
        novo.setVaca(vaca);
        return repo.save(novo);
    }

    @PutMapping("/{cnir}/{idVaca}")
    public ResponseEntity<ProducaoVaca> atualizar(@PathVariable String cnir, @PathVariable int idVaca, @RequestBody ProducaoVaca dados) {
        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId).map(producao_vaca -> {
            producao_vaca.setDataSecagem(dados.getDataSecagem());
            producao_vaca.setDataUltimaCtgLeite(dados.getDataUltimaCtgLeite());
            producao_vaca.setDataUltimaSecagem(dados.getDataUltimaSecagem());
            producao_vaca.setQtdLactacoes(dados.getQtdLactacoes());
            producao_vaca.setUltimaCtgLeite(producao_vaca.getUltimaCtgLeite());
            return ResponseEntity.ok(repo.save(producao_vaca));
        }).orElse(ResponseEntity.notFound().build());
    }

@PutMapping("/{idVaca}/contagem-leite")
    public ResponseEntity<ProducaoVaca> atualizarContagemLeite(@PathVariable Integer idVaca, @RequestBody ProducaoVaca dados, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId id = new VacaId(idVaca, cnir);

        return repo.findById(id).map(producao -> {
            producao.setDataUltimaCtgLeite(dados.getDataUltimaCtgLeite());
            producao.setUltimaCtgLeite(dados.getUltimaCtgLeite());
            return ResponseEntity.ok(repo.save(producao));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{cnir}/{idVaca}")
    public ResponseEntity<Void> deletar(@PathVariable String cnir, @PathVariable int idVaca) {
        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
