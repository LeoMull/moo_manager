package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Usuario;
import com.mooManager.MooManager.model.UsuarioId;
import com.mooManager.MooManager.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/form")
    public String mostrarFormulario() {
        return "form_user2.html";
    }

    @GetMapping("/gerente")
    public String sougerente() {
        return "sou_gerente papae";
    }

    @GetMapping("/funcionario")
    public String soufuncionario() {
        return "sou_funcionario papae";
    }


    @GetMapping("/{cnir}/{email}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable String cnir, @PathVariable String email) {
        UsuarioId usuarioId = new UsuarioId(email, cnir);
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        return usuario != null ? ResponseEntity.ok(usuario) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Usuario criar(@RequestBody Usuario novo) {
        return usuarioService.salvarUsuario(novo);
    }

    // PUT com chave composta: /api/usuarios/{cnir}/{email}
    @PutMapping("/{cnir}/{email}")
    public ResponseEntity<Usuario> atualizar(@PathVariable String cnir, @PathVariable String email, @RequestBody Usuario dados) {
        UsuarioId usuarioId = new UsuarioId(email, cnir);
        Usuario usuarioExistente = usuarioService.buscarPorId(usuarioId);
        if (usuarioExistente == null) {
            return ResponseEntity.notFound().build();
        }

        usuarioExistente.setNome(dados.getNome());
        usuarioExistente.setCpf(dados.getCpf());
        usuarioExistente.setSenha(dados.getSenha());
        usuarioExistente.setNivelDeAcesso(dados.getNivelDeAcesso());
        usuarioExistente.setPropriedade(dados.getPropriedade());

        Usuario atualizado = usuarioService.salvarUsuario(usuarioExistente);
        return ResponseEntity.ok(atualizado);
    }

    // DELETE com chave composta: /api/usuarios/{cnir}/{email}
    @DeleteMapping("/{cnir}/{email}")
    public ResponseEntity<Void> deletar(@PathVariable String cnir, @PathVariable String email) {
        UsuarioId usuarioId = new UsuarioId(email, cnir);
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        usuarioService.deletarUsuario(usuarioId);
        return ResponseEntity.noContent().build();
    }
}
