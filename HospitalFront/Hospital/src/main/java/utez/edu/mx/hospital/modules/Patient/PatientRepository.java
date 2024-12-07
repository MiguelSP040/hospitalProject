package utez.edu.mx.hospital.modules.Patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findAll();

    Patient findById(long idPatient);

    Patient save(Patient patient);

    @Modifying
    @Query(value = "UPDATE patient SET is_discharged = :isDischarged WHERE id = :idPatient", nativeQuery = true)
    void changeDischarged (@Param("isDischarged") boolean isDischarged, @Param("idPatient") long idPatient);

    @Modifying
    @Query(value = "SELECT * FROM patient WHERE is_discharged = 0;", nativeQuery = true)
    List<Patient> findAllPatientsNotDischarged();


}
