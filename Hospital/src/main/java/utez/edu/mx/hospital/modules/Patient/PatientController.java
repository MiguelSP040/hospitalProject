package utez.edu.mx.hospital.modules.Patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
public class PatientController {
    @Autowired
    private PatientService patientService;

    @GetMapping("")
    public ResponseEntity<?> getAllPatients() {
        return patientService.findAllPatients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable long id) {
        return patientService.findPatientById(id);
    }

    @PostMapping("")
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @PutMapping("")
    public ResponseEntity<?> updatePatient(@RequestBody Patient patient) {
        return patientService.updatePatient(patient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> changePatientDischarge(@PathVariable long id) {
        return patientService.changePatientDischarge(id);
    }
}
