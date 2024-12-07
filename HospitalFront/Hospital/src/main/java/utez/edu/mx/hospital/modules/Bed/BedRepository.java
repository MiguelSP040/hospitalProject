package utez.edu.mx.hospital.modules.Bed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.hospital.modules.Bed.BedDTO.BedDTO;
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

    Bed findCompleteById(long id);

    //Guardar una cama
    Bed save (Bed bed);

    // Encontrar camas por piso
    List<Bed> findByFloor_Id(long idFloor);

    // Encontrar camas disponibles en un piso
    @Query(value = "SELECT * FROM Bed WHERE id_floor = :idFloor AND is_occupied = false", nativeQuery = true)
    List<Bed> findAvailableBedsByFloor(@Param("idFloor") long idFloor);

    //Encontrar camas sin enfermera en un piso
    @Query(value = "SELECT * FROM Bed WHERE id_floor = :idFloor AND has_nurse = false", nativeQuery = true)
    List<Bed> findBedsWithoutNurseInFloor(@Param("idFloor") long idFloor);

    //metodo traer pisos que tengan camas sin enfermeras
    @Query(value = "select b.* from bed b " +
            "join floor f on b.id_floor = f.id " +
            "where b.has_nurse = false",
            nativeQuery = true)
    List<Bed> findFloorsWithBedsHasNurseIsNull();

    // Método en BedRepository para contar camas vacías en un piso específico
    @Query("SELECT COUNT(b) FROM Bed b WHERE b.floor.id = :idFloor AND b.hasNurse = false")
    long countEmptyBedsInFloor(@Param("idFloor") long idFloor);

    @Query("SELECT b.identificationName FROM Bed b WHERE b.patient.id = :idPatient")
    String findBedNameByPatientId(@Param("idPatient") long idPatient);

    @Query(value = "SELECT b.* FROM bed b JOIN user_has_beds ub ON b.id = ub.id_bed WHERE ub.id_user = :idUser", nativeQuery = true)
    List<Bed> findBedsByUserId(@Param("idUser") long idUser);
}