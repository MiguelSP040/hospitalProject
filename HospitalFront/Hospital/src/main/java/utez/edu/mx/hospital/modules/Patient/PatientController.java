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

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_NURSE')")
    public ResponseEntity<?> getAllPatients() {
        return patientService.findAllPatients();
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_NURSE')")
    public ResponseEntity<?> getPatientById(@PathVariable long id) {
        return patientService.findPatientById(id);
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_NURSE')")
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @PutMapping("")
    @PreAuthorize("hasRole('ROLE_NURSE')")
    public ResponseEntity<?> updatePatient(@RequestBody Patient patient) {
        return patientService.updatePatient(patient);
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
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
