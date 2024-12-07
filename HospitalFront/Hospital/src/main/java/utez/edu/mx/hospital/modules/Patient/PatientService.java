package utez.edu.mx.hospital.modules.Patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.utils.CustomResponseEntity;

import java.sql.Date;
import java.sql.SQLException;
import java.util.List;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllPatients(){
        List<Patient> patients = patientRepository.findAll();
        if (patients.isEmpty()) {
            return customResponseEntity.getOkResponse(
                    "Aún no hay pacientes registrados.",
                    "OK",
                    200,
                    patients
            );
        }else{
            return customResponseEntity.getOkResponse(
                    "Operación exitosa.",
                    "OK",
                    200,
                    patients
            );
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findPatientById(long id){
        Patient found = patientRepository.findById(id);
        if (found == null) {
            return customResponseEntity.get404Response();
        }else{
            return customResponseEntity.getOkResponse(
                    "Operación exitosa.",
                    "OK",
                    200,
                    found
            );
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> savePatient(Patient patient){
        try{
            Date date = new Date(System.currentTimeMillis());
            String assignmentDate = date.toString();
            patient.setAssignmentDate(assignmentDate);
            patient.setDischarged(false);
            patientRepository.save(patient);
            return customResponseEntity.getOkResponse(
                    "Paciente registrado exitosamente.",
                    "CREATED",
                    201,
                    null
            );
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> updatePatient(Patient patient){
        Patient found = patientRepository.findById(patient.getId());
        if (found == null) {
            return customResponseEntity.get404Response();
        }else{
            try{
                patient.setAssignmentDate(found.getAssignmentDate());
                patient.setDischarged(found.isDischarged());
                patientRepository.save(patient);
                return customResponseEntity.getOkResponse(
                        "La información del paciente se actualizó exitosamente.",
                        "OK",
                        200,
                        null
                );
            }catch (Exception e){
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> changePatientDischarge(long id){
        Patient found = patientRepository.findById(id);
        if (found == null) {
            return customResponseEntity.get404Response();
        }else{
            if (!found.isDischarged()) {
                try{
                    patientRepository.changeDischarged(!found.isDischarged(),id);
                    return customResponseEntity.getOkResponse(
                            "El paciente se ha dado de alta exitosamente.",
                            "OK",
                            200,
                            null
                    );
                }catch (Exception e){
                    e.printStackTrace();
                    System.out.println(e.getMessage());
                    return customResponseEntity.get400Response();
                }
            }else{
                return customResponseEntity.get400Response();
            }
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllPatientsNotDischarged(){
        List<Patient> patients = patientRepository.findAllPatientsNotDischarged();
        if (patients.isEmpty()) {
            return customResponseEntity.getOkResponse(
                    "Aún no hay pacientes registrados.",
                    "OK",
                    200,
                    patients
            );
        }else{
            return customResponseEntity.getOkResponse(
                    "Operación exitosa.",
                    "OK",
                    200,
                    patients
            );
        }
    }
}
