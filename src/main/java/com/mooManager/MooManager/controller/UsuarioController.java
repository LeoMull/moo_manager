package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.model.Usuario;
import com.mooManager.MooManager.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    //@GetMapping
    //public List<Usuario> listarTodos() {
    //    return usuarioService.buscarTodos();
    //}

    @GetMapping("/form")
    public String mostrarFormulario() {
        return "form_user2.html";
    }

    @GetMapping("/gerente")
    public String sougerente(){
        return "sou_gerente papae";
    }

    @GetMapping("/funcionario")
    public String soufuncionario(){
        return "sou_funcionario papae";
    }

    @GetMapping("/{email}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable String email) {
        Usuario usuario = usuarioService.buscarPorEmail(email);
        return usuario != null ? ResponseEntity.ok(usuario) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Usuario criar(@RequestBody Usuario novo) {
        return usuarioService.salvarUsuario(novo);
    }

    @PutMapping("/{email}")
    public ResponseEntity<Usuario> atualizar(@PathVariable String email, @RequestBody Usuario dados) {
        Usuario usuarioExistente = usuarioService.buscarPorEmail(email);
        if (usuarioExistente == null) {
            return ResponseEntity.notFound().build();
        }

        usuarioExistente.setNome(dados.getNome());
        usuarioExistente.setCpf(dados.getCpf());
        usuarioExistente.setSenha(dados.getSenha()); // você pode criptografar aqui também
        usuarioExistente.setNivelDeAcesso(dados.getNivelDeAcesso());
        usuarioExistente.setPropriedade(dados.getPropriedade());

        Usuario atualizado = usuarioService.salvarUsuario(usuarioExistente);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<Void> deletar(@PathVariable String email) {
        Usuario usuario = usuarioService.buscarPorEmail(email);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.deletarUsuario(email);
        return ResponseEntity.noContent().build();
    }
}
