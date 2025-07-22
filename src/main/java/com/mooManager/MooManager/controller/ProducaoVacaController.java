package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.ProducaoVaca;
import com.mooManager.MooManager.model.VacaId;
import com.mooManager.MooManager.repository.ProducaoVacaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/producao_vaca")
public class ProducaoVacaController {

    private final ProducaoVacaRepository repo;
    
    public ProducaoVacaController(ProducaoVacaRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{cnir}/{idVaca}")
    public ResponseEntity<ProducaoVaca> buscarPorChave(@PathVariable String cnir, @PathVariable int idVaca) {
        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProducaoVaca criar(@RequestBody ProducaoVaca novo) {
        return repo.save(novo);
    }

    @PutMapping("/{cnir}/{idVaca}")
    public ResponseEntity<ProducaoVaca> atualizar(@PathVariable String cnir, @PathVariable int idVaca, @RequestBody ProducaoVaca dados) {
        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId).map(producao_vaca -> {
            producao_vaca.setDataSecagem(dados.getDataSecagem());
            return ResponseEntity.ok(repo.save(producao_vaca));
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
