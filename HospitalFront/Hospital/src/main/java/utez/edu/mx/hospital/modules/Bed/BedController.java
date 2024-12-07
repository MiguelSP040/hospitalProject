package utez.edu.mx.hospital.modules.Bed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> findAll(){
        return bedService.findAll();
    }

    //traer por el id de cama
    @GetMapping("/{idBed}")
    public ResponseEntity<?> findById(@PathVariable("idBed") long idBed){
        return bedService.findById(idBed);
    }

    //guardar cama
    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Bed bed){
        return bedService.save(bed);
    }

    //actualizar cama
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Bed bed){
        return bedService.update(bed);
    }

    //Encontrar camas por piso
    @GetMapping("/bedOnFloor/{idFloor}")
    public ResponseEntity<?> findBedOnFloor(@PathVariable ("idFloor") long idFloor){
        return bedService.findByFloor(idFloor);
    }


    //Encontrar camas disponibles por piso
    @GetMapping("/available/{idFloor}")
    public ResponseEntity<?> findAvailableByFloor(@PathVariable("idFloor") long idFloor){
        return bedService.findAvailableBedsByFloor(idFloor);
    }

    //Encontrar las camas sin enfermera por piso
    @GetMapping("/withoutNurse/{idFloor}")
    public ResponseEntity<?> findBedsWithoutNurse(@PathVariable ("idFloor") long idFloor) {
        return bedService.findBedsWithoutNurseInFloor(idFloor);
    }

    //mostrar los pisos con camas sin enfermera
    @GetMapping("/floorsWithoutNurse")
    public ResponseEntity<?> findFloorsWithoutNurse() {
        return bedService.findFloorsWithoutNurse();
    }

    //contador de camas vacias por piso
    @GetMapping("/countEmptyBeds/{idFloor}")
    public ResponseEntity<?> countEmptyBedsInFloor(@PathVariable("idFloor") long idFloor) {
        return bedService.countEmptyBedsInFloor(idFloor);
    }

    @GetMapping("/findBedName/{idPatient}")
    public ResponseEntity<?> getBedNameByPatientId(@PathVariable("idPatient") long idPatient) {
        return bedService.findBedNameByPatientId(idPatient);
    }
}
