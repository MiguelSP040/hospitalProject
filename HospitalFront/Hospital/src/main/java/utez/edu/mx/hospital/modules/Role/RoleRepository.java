package utez.edu.mx.hospital.modules.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    //trae todos los roles
    List<Role> findAll();

    @Query(value = "SELECT id_role FROM user WHERE username = :username", nativeQuery = true)
    int findRoleByUsername(@Param("username") String username);


}
