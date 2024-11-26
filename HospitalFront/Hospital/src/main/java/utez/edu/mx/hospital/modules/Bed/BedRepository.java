package utez.edu.mx.hospital.modules.Bed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.hospital.modules.Floor.Floor;
import utez.edu.mx.hospital.modules.User.User;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    // método para contar camas que tiene nurse
    long countByUsers(User user);

    //Encontrar todas las camas
    List<Bed> findAll();

    //Encontrar cama por id
    Bed findById(long id);

    //Guardar una cama
    Bed save (Bed bed);

    // Encontrar camas por piso
    List<Bed> findByFloor(Floor floor);

    // Encontrar camas disponibles en un piso
    @Query(value = "SELECT * FROM Bed WHERE id_floor = :idFloor AND is_occupied = false", nativeQuery = true)
    List<Bed> findAvailableBedsByFloor(@Param("idFloor") long idFloor);

    //Encontrar camas sin enfermera en un piso
    @Query(value ="SELECT * FROM Bed  WHERE id_floor = :idFloor AND (has_nurse = false OR has_nurse IS NULL)", nativeQuery = true)
    List<Bed> findBedsWithoutNurseInFloor(@Param("idFloor") long idFloor);
}