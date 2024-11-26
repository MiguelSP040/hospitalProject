package utez.edu.mx.hospital.modules.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    //trae todos los roles
    List<Role> findAll();
}
