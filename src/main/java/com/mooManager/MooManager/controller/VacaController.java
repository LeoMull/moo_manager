package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Vaca;
import com.mooManager.MooManager.model.VacaId;
import com.mooManager.MooManager.repository.VacaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mooManager.MooManager.security.JwtUtil;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/vacas")
public class VacaController {
    private final VacaRepository repo;
    private final JwtUtil jwtUtil;

    public VacaController(VacaRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Vaca> listarTodos(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        return repo.findAllByIdCnir(cnir);
    }

    @GetMapping("/{idVaca}")
    public ResponseEntity<Vaca> buscarPorId(@PathVariable Integer idVaca,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Vaca criar(@RequestBody Vaca novo, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        if (cnir.equals(novo.getId().getCnir())) {
            return repo.save(novo);
        } else {
            throw new IllegalArgumentException("CNIR do token não corresponde ao CNIR da vaca");
        }
    }

    @PutMapping("/{idVaca}")
    public ResponseEntity<Vaca> atualizar(@PathVariable Integer idVaca, @RequestBody Vaca dados,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId).map(vaca -> {
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
    public ResponseEntity<Void> deletar(@PathVariable Integer idVaca,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        VacaId vacaId = new VacaId(idVaca, cnir);
        return repo.findById(vacaId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
