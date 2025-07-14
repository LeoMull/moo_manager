package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Usuario;
import com.mooManager.MooManager.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    private final UsuarioRepository repo;

    public UsuarioController(UsuarioRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/form")
    public String mostrarFormulario() {
        return "form_user2.html"; // retorna templates/formulario_usuario.html
    }

    @GetMapping("/{email}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable String email) {
        return repo.findById(email).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Usuario criar(@RequestBody Usuario novo) {
        return repo.save(novo);
    }

    @PutMapping("/{email}")
    public ResponseEntity<Usuario> atualizar(@PathVariable String email, @RequestBody Usuario dados) {
        return repo.findById(email).map(usuario -> {
        usuario.setNome(dados.getNome());
        usuario.setCpf(dados.getCpf());
        usuario.setSenha(dados.getSenha());
        usuario.setNivelDeAcesso(dados.getNivelDeAcesso());
        usuario.setPropriedade(dados.getPropriedade());
        return ResponseEntity.ok(repo.save(usuario));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{email}")
    public ResponseEntity<Void> deletar(@PathVariable String email) {
        return repo.findById(email).map(e -> {
            repo.delete(e);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
    
}
  