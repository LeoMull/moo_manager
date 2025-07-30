package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Lote;
import com.mooManager.MooManager.model.ProducaoVaca;
import com.mooManager.MooManager.model.Propriedade;
import com.mooManager.MooManager.model.VacaId;
import com.mooManager.MooManager.repository.ProducaoVacaRepository;
import com.mooManager.MooManager.repository.VacaRepository;
import com.mooManager.MooManager.security.JwtUtil;

import java.util.ArrayList;
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
public ResponseEntity<?> criar(
        @RequestBody ProducaoVaca novo,
        @RequestHeader("Authorization") String authHeader,
        @PathVariable Integer idVaca) {
    try {
        if (novo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("O corpo da requisição não pode estar vazio.");
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token de autenticação ausente ou inválido.");
        }

        String token = authHeader.replace("Bearer ", "");
        String cnir;
        try {
            cnir = jwtUtil.getCnirFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Não foi possível validar o token.");
        }

        VacaId vacaId = new VacaId(idVaca, cnir);
        Vaca vaca = vacaRepo.findById(vacaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        novo.setVaca(vaca);

        ProducaoVaca salvo = repo.save(novo);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);

    } catch (ResponseStatusException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Vaca com id " + idVaca + " não encontrada para este usuário.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno ao salvar a produção da vaca: " + e.getMessage());
    }
}


    @PostMapping("/bulk")
    public List<ProducaoVaca> criarEmLote(@RequestBody List<ProducaoVaca> producoes, @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String cnir = jwtUtil.getCnirFromToken(token);

        List<ProducaoVaca> salvos = new ArrayList<>();

        for (ProducaoVaca novo : producoes) {
            if (novo.getVaca() == null || novo.getVaca().getId().getIdVaca() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cada produção deve conter um idVaca");
            }

            VacaId vacaId = new VacaId(novo.getVaca().getId().getIdVaca(), cnir);
            Vaca vaca = vacaRepo.findById(vacaId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vaca não encontrada: " + vacaId.getIdVaca()));

            novo.setVaca(vaca);
            salvos.add(repo.save(novo));
        }

        return salvos;
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

    @PutMapping("/bulk/contagem-leite")
    public ResponseEntity<?> atualizarOuCriarContagemLeiteEmLote(
            @RequestBody List<ProducaoVaca> dadosList,
            @RequestHeader("Authorization") String authHeader) {
        System.out.println("[INFO] Iniciando atualização/criação em lote de contagem de leite...");

        try {
            if (dadosList == null || dadosList.isEmpty()) {
                System.out.println("[ERRO] Lista de produções está vazia ou nula.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("A lista de produções não pode estar vazia.");
            }

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("[ERRO] Token ausente ou mal formatado.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token de autenticação ausente ou inválido.");
            }

            String token = authHeader.replace("Bearer ", "");
            String cnir = jwtUtil.getCnirFromToken(token);
            System.out.println("[INFO] Token validado. CNIR: " + cnir);

            List<ProducaoVaca> salvos = new ArrayList<>();

            for (ProducaoVaca dados : dadosList) {
                try {
                    if (dados.getVaca() == null || dados.getVaca().getId() == null || dados.getVaca().getId().getIdVaca() == null) {
                        System.out.println("[ERRO] Um dos itens não contém idVaca válido: " + dados);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Cada item deve conter um idVaca válido.");
                    }

                    Integer idVaca = dados.getVaca().getId().getIdVaca();
                    VacaId id = new VacaId(idVaca, cnir);

                    System.out.println("[INFO] Processando vaca ID: " + idVaca);

                    ProducaoVaca salvo = repo.findById(id).map(producao -> {
                        System.out.println("[INFO] Registro encontrado. Atualizando vaca ID: " + idVaca);
                        producao.setDataUltimaCtgLeite(dados.getDataUltimaCtgLeite());
                        producao.setUltimaCtgLeite(dados.getUltimaCtgLeite());
                        return repo.save(producao);
                    }).orElseGet(() -> {
                        System.out.println("[INFO] Registro não encontrado. Criando novo para vaca ID: " + idVaca);
                        Vaca vaca = vacaRepo.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Vaca com id " + id.getIdVaca() + " não encontrada para este usuário."
                                ));
                        dados.setId(id);
                        dados.setVaca(vaca);
                        return repo.save(dados);
                    });

                    salvos.add(salvo);
                } catch (ResponseStatusException e) {
                    System.out.println("[ERRO] Vaca não encontrada: " + e.getReason());
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
                } catch (Exception e) {
                    System.out.println("[ERRO] Falha ao processar vaca: " + e.getMessage());
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Erro ao processar vaca: " + e.getMessage());
                }
            }

            System.out.println("[INFO] Processo concluído. Total de registros salvos: " + salvos.size());
            return ResponseEntity.ok(salvos);

        } catch (Exception e) {
            System.out.println("[ERRO] Erro inesperado no processamento em lote: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao processar as produções: " + e.getMessage());
        }
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
