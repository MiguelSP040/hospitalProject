package utez.edu.mx.hospital.modules.Patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = {"*"})
public class PatientController {
    @Autowired
    private PatientService patientService;

    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_NURSE')")
    public ResponseEntity<?> getAllPatients() {
        return patientService.findAllPatients();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_NURSE')")
    public ResponseEntity<?> getPatientById(@PathVariable long id) {
        return patientService.findPatientById(id);
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_NURSE')")
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @PutMapping("")
    @PreAuthorize("hasRole('ROLE_NURSE')")
    public ResponseEntity<?> updatePatient(@RequestBody Patient patient) {
        return patientService.updatePatient(patient);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_NURSE')")
    public ResponseEntity<?> changePatientDischarge(@PathVariable long id) {
        return patientService.changePatientDischarge(id);
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @GetMapping("/withoutBed")
    public ResponseEntity<?> findAllPatientsNotDischargedAndBedIsNotOccupied() {
        return patientService.getAllPatientsNotDischargedAndBedIsNotOccupied();
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @GetMapping("/notDischarged")
    public ResponseEntity<?> getAllPatientsNotDischarged() {
        return patientService.findAllPatientsNotDischarged();
    }


}
