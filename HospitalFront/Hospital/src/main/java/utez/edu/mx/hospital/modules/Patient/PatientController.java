package utez.edu.mx.hospital.modules.Patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = {"*"})
public class PatientController {
    @Autowired
    private PatientService patientService;

    @GetMapping("")
    @Secured("ROLE_NURSE")
    public ResponseEntity<?> getAllPatients() {
        return patientService.findAllPatients();
    }

    @GetMapping("/{id}")
    @Secured("ROLE_NURSE")
    public ResponseEntity<?> getPatientById(@PathVariable long id) {
        return patientService.findPatientById(id);
    }

    @PostMapping("")
    @Secured("ROLE_NURSE")
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @PutMapping("")
    @Secured("ROLE_NURSE")
    public ResponseEntity<?> updatePatient(@RequestBody Patient patient) {
        return patientService.updatePatient(patient);
    }

    @PutMapping("/{id}")
    @Secured("ROLE_NURSE")
    public ResponseEntity<?> changePatientDischarge(@PathVariable long id) {
        return patientService.changePatientDischarge(id);
    }
}
