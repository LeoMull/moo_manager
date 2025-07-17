package com.mooManager.MooManager.service;

import com.mooManager.MooManager.model.Usuario;
import com.mooManager.MooManager.model.UsuarioId;
import com.mooManager.MooManager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public Usuario salvarUsuario(Usuario usuario) {
        String senhaCriptografada = encoder.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);
        return usuarioRepo.save(usuario);
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepo.findByUsuarioIdEmail(email).orElse(null);
    }

    public boolean verificarSenha(String senhaDigitada, String senhaCriptografada) {
        return encoder.matches(senhaDigitada, senhaCriptografada);
    }

    public void deletarUsuario(String email) {
        usuarioRepo.deleteById(new UsuarioId(email, null));
    }
    public Usuario buscarPorId(UsuarioId id) {
        return usuarioRepo.findById(id).orElse(null);
    }

    public void deletarUsuario(UsuarioId id) {
        usuarioRepo.deleteById(id);
    }

    
}
