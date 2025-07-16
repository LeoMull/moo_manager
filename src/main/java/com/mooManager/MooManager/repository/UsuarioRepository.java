package com.mooManager.MooManager.repository;

import com.mooManager.MooManager.model.Usuario;
import com.mooManager.MooManager.model.UsuarioId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, UsuarioId> {
    Optional<Usuario> findByUsuarioIdEmail(String email);
    List<Usuario> findByUsuarioIdCnir(String cnir);
}
