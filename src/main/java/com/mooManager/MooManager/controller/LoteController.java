package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Lote;
import com.mooManager.MooManager.model.LoteId;
import com.mooManager.MooManager.model.Propriedade;
import com.mooManager.MooManager.repository.LoteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mooManager.MooManager.security.JwtUtil;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/lotes")
public class LoteController {
    private final LoteRepository repo;
    private final JwtUtil jwtUtil;

    public LoteController(LoteRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    //@GetMapping
    //public List<Lote> listarTodos(@RequestHeader("Authorization") String authHeader) {
    //    String token = authHeader.replace("Bearer ", "");
    //    String cnir = jwtUtil.getCnirFromToken(token);
    //    return repo.findAllByIdCnir(cnir);
    //}

    @GetMapping
    public ResponseEntity<List<Lote>> buscarPorId(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        List<Lote> lotes = repo.findByIdCnir(cnir);
        if (lotes.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 caso não haja filtros
        }
        return ResponseEntity.ok(lotes);
    }

    @PostMapping
    public Lote criar(@RequestBody Lote novo, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        if (cnir.equals(novo.getId().getCnir())) {
            return repo.save(novo);
        } else {
            throw new IllegalArgumentException("CNIR do token não corresponde ao CNIR da Lote");
        }
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> criarFiltros(
            @RequestBody List<Lote> filtros,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (filtros == null || filtros.isEmpty()) {
                return ResponseEntity.badRequest().body("A lista de filtros não pode estar vazia.");
            }

            String token = authHeader.replace("Bearer ", "");
            String cnir = jwtUtil.getCnirFromToken(token);

            // Verifica CNIR e seta propriedade
            for (Lote filtro : filtros) {
                if (filtro.getId() == null || filtro.getId().getCnir() == null) {
                    return ResponseEntity.badRequest().body("Filtro sem ID ou CNIR definido: " + filtro.getRotulo());
                }
                if (!cnir.equals(filtro.getId().getCnir())) {
                    return ResponseEntity.status(403).body("CNIR do token não corresponde ao CNIR do filtro: " + filtro.getRotulo());
                }
                // Preenche a propriedade se vier nula (para evitar erro no Hibernate)
                if (filtro.getPropriedade() == null) {
                    Propriedade prop = new Propriedade();
                    prop.setCnir(cnir);
                    filtro.setPropriedade(prop);
                }
            }

            // (Opcional) Detecta prioridades duplicadas
            long prioridadesUnicas = filtros.stream().map(f -> f.getId().getPrioridade()).distinct().count();
            if (prioridadesUnicas != filtros.size()) {
                return ResponseEntity.badRequest().body("Existem filtros com prioridades duplicadas.");
            }

            List<Lote> salvos = repo.saveAll(filtros);
            return ResponseEntity.ok(salvos);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno ao salvar filtros: " + e.getMessage());
        }
    }



    @PutMapping
    public ResponseEntity<Lote> atualizar(@RequestBody Lote dados, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        Integer prioridade = dados.getId().getPrioridade();
        LoteId loteId = new LoteId(cnir,prioridade);

        return repo.findById(loteId).map(lote -> {
            lote.setOperador(dados.getOperador());
            lote.setValor(dados.getValor());
            lote.setCampo(dados.getCampo());
            lote.setRotulo(dados.getRotulo());
            return ResponseEntity.ok(repo.save(lote));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{prioridade}")
    public ResponseEntity<Void> deletar(@PathVariable Integer prioridade, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);
        LoteId loteId = new LoteId(cnir, prioridade);
        return repo.findById(loteId).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping
    public ResponseEntity<Void> deletarTodos(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        List<Lote> filtros = repo.findByIdCnir(cnir);
        if (filtros.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        repo.deleteAll(filtros);
        return ResponseEntity.noContent().build();
    }

}
