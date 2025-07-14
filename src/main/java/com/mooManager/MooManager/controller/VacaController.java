package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Vaca;
import com.mooManager.MooManager.repository.VacaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacas")
@CrossOrigin(origins = "*")
public class VacaController {
    private final VacaRepository repo;

    public VacaController(VacaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Vaca> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/{idVaca}")
    public ResponseEntity<Vaca> buscarPorId(@PathVariable Integer idVaca) {
        return repo.findById(idVaca).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Vaca criar(@RequestBody Vaca novo) {
        return repo.save(novo);
    }

    @PutMapping("/{idVaca}")
    public ResponseEntity<Vaca> atualizar(@PathVariable Integer idVaca, @RequestBody Vaca dados) {
        return repo.findById(idVaca).map(vaca -> {
            vaca.setSexo(dados.getSexo());
            vaca.setRaca(dados.getRaca());
            vaca.setDataNasc(dados.getDataNasc());
            vaca.setCategoria(dados.getCategoria());
            vaca.setLote(dados.getLote());
            vaca.setPrecisaAtendimento(dados.getPrecisaAtendimento());
            vaca.setObservacao(dados.getObservacao());
            vaca.setPeso(dados.getPeso());
            vaca.setDataUltimaPesagem(dados.getDataUltimaPesagem());
            vaca.setIdMae(dados.getIdMae());
            vaca.setNomeMae(dados.getNomeMae());
            vaca.setNomePai(dados.getNomePai());
            vaca.setIdPai(dados.getIdPai());
            return ResponseEntity.ok(repo.save(vaca));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{idVaca}")
    public ResponseEntity<Void> deletar(@PathVariable Integer idVaca) {
        return repo.findById(idVaca).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
    
}
  