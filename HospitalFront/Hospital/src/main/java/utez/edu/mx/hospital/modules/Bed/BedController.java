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
    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> findAll(){
        return bedService.findAll();
    }

    //traer por el id de cama
    @GetMapping("/{idBed}")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> findById(@PathVariable("idBed") long idBed){
        return bedService.findById(idBed);
    }

    //guardar cama
    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> save(@RequestBody Bed bed){
        return bedService.save(bed);
    }

    //actualizar cama
    @PutMapping("")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> update(@RequestBody Bed bed){
        return bedService.update(bed);
    }

    //Encontrar camas por piso
    @GetMapping("/bedOnFloor/{idFloor}")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> findBedOnFloor(@PathVariable ("idFloor") long idFloor){
        return bedService.findByFloor(idFloor);
    }


    //Encontrar camas disponibles por piso
    @GetMapping("/available/{idFloor}")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> findAvailableByFloor(@PathVariable("idFloor") long idFloor){
        return bedService.findAvailableBedsByFloor(idFloor);
    }

    //Encontrar las camas sin enfermera por piso
    @GetMapping("/withoutNurse/{idFloor}")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> findBedsWithoutNurse(@PathVariable ("idFloor") long idFloor) {
        return bedService.findBedsWithoutNurseInFloor(idFloor);
    }

    //mostrar los pisos con camas sin enfermera
    @GetMapping("/floorsWithoutNurse")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> findFloorsWithoutNurse() {
        return bedService.findFloorsWithoutNurse();
    }

    //contador de camas vacias por piso
    @GetMapping("/countEmptyBeds/{idFloor}")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> countEmptyBedsInFloor(@PathVariable("idFloor") long idFloor) {
        return bedService.countEmptyBedsInFloor(idFloor);
    }

    @GetMapping("/findBedName/{idPatient}")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> getBedNameByPatientId(@PathVariable("idPatient") long idPatient) {
        return bedService.findBedNameByPatientId(idPatient);
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @GetMapping("/findBedsByNurse/{idNurse}")
    public ResponseEntity<?> getBedsByNurse(@PathVariable("idNurse") long idNurse) {
        return bedService.findBedsByNurseId(idNurse);
    }


}
