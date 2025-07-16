package com.mooManager.MooManager.controller;

import com.mooManager.MooManager.dto.LoginDTO;
import com.mooManager.MooManager.model.Usuario;
import com.mooManager.MooManager.security.JwtUtil;
import com.mooManager.MooManager.service.UsuarioService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        Usuario usuario = usuarioService.buscarPorEmail(loginDTO.getEmail());

        if (usuario == null || !usuarioService.verificarSenha(loginDTO.getSenha(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getNivelDeAcesso().name());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("nivelDeAcesso", usuario.getNivelDeAcesso().name());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        if (usuarioService.buscarPorEmail(usuario.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Erro: Usuário já existe.");
        }

        Usuario novoUsuario = usuarioService.salvarUsuario(usuario);
        return ResponseEntity.ok("Cadastro feito com sucesso: " + novoUsuario);
    }

}
