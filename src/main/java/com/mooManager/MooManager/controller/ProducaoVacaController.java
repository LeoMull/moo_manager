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

    @GetMapping("/{idVaca}")
    public ResponseEntity<ProducaoVaca> buscarPorChave(@RequestHeader("Authorization") String authHeader, @PathVariable Integer idVaca) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{idVaca}")
    public ProducaoVaca criar(@RequestBody ProducaoVaca novo, @RequestHeader("Authorization") String authHeader, @PathVariable Integer idVaca) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId vacaId = new VacaId(idVaca, cnir);
        Vaca vaca = vacaRepo.findById(vacaId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND));
        novo.setVaca(vaca);
        return repo.save(novo);
    }

    @PutMapping("/{idVaca}")
    public ResponseEntity<ProducaoVaca> atualizarOuCriar(@RequestHeader("Authorization") String authHeader,
                                                        @PathVariable Integer idVaca,
                                                        @RequestBody ProducaoVaca dados) {

        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId vacaId = new VacaId(idVaca, cnir);

        return repo.findById(vacaId).map(producaoExistente -> {
            producaoExistente.setDataSecagem(dados.getDataSecagem());
            producaoExistente.setDataUltimaSecagem(dados.getDataUltimaSecagem());
            producaoExistente.setQtdLactacoes(dados.getQtdLactacoes());
            producaoExistente.setUltimaCtgLeite(dados.getUltimaCtgLeite());
            producaoExistente.setDataUltimaCtgLeite(dados.getDataUltimaCtgLeite());
            return ResponseEntity.ok(repo.save(producaoExistente));
            }).orElseGet(() -> {
                Vaca vaca = vacaRepo.findById(vacaId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
                dados.setId(new VacaId(idVaca, cnir)); 
                dados.setVaca(vaca); // <<< Faltava associar a vaca!
                return ResponseEntity.ok(repo.save(dados));
            });
    }

    @PutMapping("/{idVaca}/contagem-leite")
    public ResponseEntity<ProducaoVaca> atualizarOuCriarContagemLeite(
            @PathVariable Integer idVaca,
            @RequestBody ProducaoVaca dados,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId id = new VacaId(idVaca, cnir);

        return repo.findById(id).map(producao -> {
            producao.setDataUltimaCtgLeite(dados.getDataUltimaCtgLeite());
            producao.setUltimaCtgLeite(dados.getUltimaCtgLeite());
            return ResponseEntity.ok(repo.save(producao));
        }).orElseGet(() -> {
            dados.setId(id); // necessário para criação correta
            return ResponseEntity.ok(repo.save(dados));
        });
    }
    
    @DeleteMapping("/{idVaca}")
    public ResponseEntity<Void> deletar(@RequestHeader("Authorization") String authHeader, @PathVariable Integer idVaca) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
