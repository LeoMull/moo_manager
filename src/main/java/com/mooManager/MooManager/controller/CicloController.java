
package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Ciclo;
import com.mooManager.MooManager.model.Vaca;
import com.mooManager.MooManager.model.VacaId;
import com.mooManager.MooManager.repository.CicloRepository;
import com.mooManager.MooManager.repository.VacaRepository;
import com.mooManager.MooManager.security.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.sql.Date;

@RestController
@RequestMapping("/api/ciclo")
@CrossOrigin(origins = "*")
public class CicloController {
  private final CicloRepository repo;
  private final VacaRepository vacaRepo;
  
  public CicloController(CicloRepository repo, VacaRepository vacaRepo) {
    this.repo = repo;
    this.vacaRepo = vacaRepo;
  }

  @GetMapping
  public List<Ciclo> list() {
    return repo.findAll();
  }

  @GetMapping("/{cnir}/{idVaca}")
  public ResponseEntity<Ciclo> findById(@PathVariable String cnir, @PathVariable Integer idVaca) {
    VacaId vacaId = new VacaId(idVaca, cnir);
    return repo.findById(vacaId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/{cnir}/{idVaca}")
  public Ciclo create(@RequestBody Ciclo novo, @PathVariable String cnir, @PathVariable Integer idVaca) {
    VacaId vacaId = new VacaId(idVaca, cnir);
    Vaca vaca = vacaRepo.findById(vacaId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    novo.setVaca(vaca);
    return repo.save(novo);
  }


  @PutMapping("/{cnir}/{idVaca}")
  public ResponseEntity<Ciclo> atualizar(@PathVariable Integer idVaca, @PathVariable String cnir, @RequestBody Ciclo dados) {
      VacaId vacaId = new VacaId(idVaca, cnir);

      return repo.findById(vacaId).map(cicloExistente -> {
          // Atualiza os dados do ciclo existente
          cicloExistente.setDiaAposUltTent(dados.getDiaAposUltTent());
          cicloExistente.setPrimeiroCioCiclo(dados.getPrimeiroCioCiclo());
          cicloExistente.setUltCioCiclo(dados.getUltCioCiclo());
          cicloExistente.setPrimeiraTentaCiclo(dados.getPrimeiraTentaCiclo());
          cicloExistente.setUltTentativa(dados.getUltTentativa());
          cicloExistente.setPaiUltTentativa(dados.getPaiUltTentativa());
          cicloExistente.setDoadoraUltTentativa(dados.getDoadoraUltTentativa());
          return ResponseEntity.ok(repo.save(cicloExistente));
      }).orElseGet(() -> {
          // Cria novo ciclo se não existir
          Vaca vaca = vacaRepo.findById(vacaId)
              .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vaca não encontrada"));

          dados.setId(vacaId);
          dados.setVaca(vaca); // associa a vaca corretamente
          return ResponseEntity.ok(repo.save(dados));
      });
  }


    @DeleteMapping("/{cnir}/{idVaca}")
    public ResponseEntity<Void> deletar(@PathVariable Integer idVaca, @PathVariable String cnir) {
      VacaId vacaId = new VacaId(idVaca, cnir);
      return repo.findById(vacaId).map(e -> {
        repo.delete(e);
        return ResponseEntity.noContent().<Void>build();
      }).orElse(ResponseEntity.notFound().build());
    }
}
