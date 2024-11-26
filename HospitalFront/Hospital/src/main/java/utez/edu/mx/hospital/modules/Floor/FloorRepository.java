package utez.edu.mx.hospital.modules.Floor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.User.User;

import java.util.List;

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
}
