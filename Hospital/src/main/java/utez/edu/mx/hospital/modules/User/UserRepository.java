package utez.edu.mx.hospital.modules.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //traer todos los usuarios
    List<User> findAll();

    //traer todos los usuarios por rol
    @Query(value = "SELECT * FROM user WHERE id_role = :idRole", nativeQuery = true)
    List<User> findAllByIdRol(@Param("idRole") long idRole);

    //traer usuario por id
    User findById(long idUser);

    //traer todos los usuarios por id
    User save(User user);

    @Modifying
    @Query(value = "DELETE FROM user WHERE id = :idUser", nativeQuery = true)
    void deleteById(@Param("idUser") long idUser);

    //buscar usuario por correo y contraseña
    @Query(value = "SELECT * FROM user " +
        "WHERE password = :password " + "AND (email = :username OR username = :username);",
            nativeQuery = true)
    User findByPasswordAndEmailOrUsername(@Param("password") String password,
                                          @Param("username") String username
    );

    //buscar el usuario por nombre de usuario
    User findByUsername(String username);
}
