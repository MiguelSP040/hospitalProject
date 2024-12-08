package utez.edu.mx.hospital.modules.Bed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.hospital.modules.Bed.BedDTO.BedDTO;
import utez.edu.mx.hospital.modules.Floor.Floor;
import utez.edu.mx.hospital.modules.User.User;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Map;

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

    @Query(value = "SELECT b.* FROM bed b " +
            "JOIN user_has_beds ub ON b.id = ub.id_bed " +
            "JOIN user u ON ub.id_user = u.id " +
            "WHERE u.username = :userName", nativeQuery = true)
    List<Bed> findBedsByUserName(@Param("userName") String userName);

    @Modifying
    @Query(value = "UPDATE bed SET id_patient = :idPatient WHERE id = :idBed;", nativeQuery = true)
    void insertPatientInBed(@Param("idPatient") long idPatient, @Param("idBed") long idBed);

    @Modifying
    @Query(value = "UPDATE bed SET is_occupied = :isOccupied WHERE id = :idBed;", nativeQuery = true)
    void changeIsOccupied(@Param("isOccupied") boolean isOccupied, @Param("idBed") long idBed);




}