package utez.edu.mx.hospital.modules.Floor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.User.User;

import java.util.List;
import java.util.Map;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Long> {
    Floor findById(long idFloor);   // -> este método ya se utiliza en conjunto con User

    boolean existsBySecretary(User user);  // método para verificar si un usuario es secretario en algún piso

    // Traer todos los pisos
    List<Floor> findAll();

    // Guardar / Actualizar piso
    Floor save(Floor floor);

    // Obtener camas de un piso específico
    @Query(value = "SELECT b FROM Bed b WHERE b.floor.id = :idFloor")
    List<Bed> getBedsByFloorId(@Param("idFloor") long idFloor);


    // Obtener enfermeras de un piso específico
    @Query("SELECT u FROM User u JOIN u.nurseInFloor f WHERE f.id = :idFloor AND u.role.name = 'nurse'")
    List<User> getNursesByFloorId(@Param("idFloor") long idFloor);

    @Query(value ="SELECT f.id AS floor_id, " +
            "f.identification_name AS floor_name, " +
            "b.id AS id, " +
            "b.identification_name AS bed_name, " +
            "b.is_occupied as bed_occupiedPatient," +
            "b.has_nurse AS has_nurse, " +
            "n.full_name AS nurse_name, " +
            "n.surname AS nurse_surname," +
            "n.lastname as nurse_lastname," +
            "u.full_name AS secretary_name " +
            "FROM floor f " +
            "JOIN bed b ON b.id_floor = f.id " +
            "JOIN user u ON f.secretary_in_charge = u.id " +
            "LEFT JOIN user_has_beds ub ON b.id = ub.id_bed " +
            "LEFT JOIN user n ON ub.id_user = n.id AND n.id_role = 1 " +
            "WHERE u.username = :username",
            nativeQuery = true)
    List<Map<String, Object>> findBedsAndFloorBySecretaryUsername(@Param("username") String username);

    @Query(value = "SELECT f.identification_name AS floor_name, " + "f.id as id," +
            "u.full_name AS secretary_name " +
            "FROM floor f " +
            "JOIN user u ON f.secretary_in_charge = u.id " +
            "WHERE u.username = :username",
            nativeQuery = true)
    Map<String, String> findFloorBySecretaryUsername(@Param("username") String username);

    @Query(value = "SELECT nurse_in_floor FROM user WHERE username = :username;", nativeQuery = true)
    int findNurseInFloorId(@Param("username") String username);

    @Query(value = "SELECT identification_name FROM floor WHERE id = :id;", nativeQuery = true)
    Map<String, String> findFloorNameById(@Param("id") long id);

}
