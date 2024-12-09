package utez.edu.mx.hospital.modules.Bed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.hospital.modules.Floor.Floor;
import utez.edu.mx.hospital.modules.Floor.FloorService;
import utez.edu.mx.hospital.modules.User.User;
import utez.edu.mx.hospital.modules.User.UserService;

@RestController
@RequestMapping("/api/bed")
@CrossOrigin(origins = {"*"})
public class BedController {
    @Autowired
    private BedService bedService;

    //Traer todas las camas
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    @GetMapping("")
    public ResponseEntity<?> findAll(){
        return bedService.findAll();
    }

    //traer por el id de cama
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    @GetMapping("/{idBed}")
    public ResponseEntity<?> findById(@PathVariable("idBed") long idBed){
        return bedService.findById(idBed);
    }

    //guardar cama
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Bed bed){
        return bedService.save(bed);
    }

    //actualizar cama
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Bed bed){
        return bedService.update(bed);
    }

    //Encontrar camas por piso
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("/bedOnFloor/{idFloor}")
    public ResponseEntity<?> findBedOnFloor(@PathVariable ("idFloor") long idFloor){
        return bedService.findByFloor(idFloor);
    }


    //Encontrar camas disponibles por piso
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("/available/{idFloor}")
    public ResponseEntity<?> findAvailableByFloor(@PathVariable("idFloor") long idFloor){
        return bedService.findAvailableBedsByFloor(idFloor);
    }

    //Encontrar las camas sin enfermera por piso
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    @GetMapping("/withoutNurse/{idFloor}")
    public ResponseEntity<?> findBedsWithoutNurse(@PathVariable ("idFloor") long idFloor) {
        return bedService.findBedsWithoutNurseInFloor(idFloor);
    }

    //mostrar los pisos con camas sin enfermera
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("/floorsWithoutNurse")
    public ResponseEntity<?> findFloorsWithoutNurse() {
        return bedService.findFloorsWithoutNurse();
    }

    //contador de camas vacias por piso
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("/countEmptyBeds/{idFloor}")
    public ResponseEntity<?> countEmptyBedsInFloor(@PathVariable("idFloor") long idFloor) {
        return bedService.countEmptyBedsInFloor(idFloor);
    }

    @PreAuthorize("hasRole('ROLE_NURSE') or hasRole('ROLE_SECRETARY')")
    @GetMapping("/findBedName/{idPatient}")
    public ResponseEntity<?> getBedNameByPatientId(@PathVariable("idPatient") long idPatient) {
        return bedService.findBedNameByPatientId(idPatient);
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @GetMapping("/findBedsByNurse/{nurseName}")
    public ResponseEntity<?> getBedsByNurse(@PathVariable("nurseName") String nurseName) {
        return bedService.findBedsByNurseName(nurseName);
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @PutMapping("/insertPatient")
    public ResponseEntity<?> insertPatient(@RequestBody Bed bed) {
        return bedService.insertPatient(bed);
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @PutMapping("/freeBed/{id}")
    public ResponseEntity<?> freeBed(@PathVariable("id") long id) {
        return bedService.freeBed(id);
    }
}
