package utez.edu.mx.hospital.modules.Floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.hospital.modules.Bed.BedService;
import utez.edu.mx.hospital.modules.User.User;

import java.util.List;

@RestController
@RequestMapping("/api/floor")
@CrossOrigin(origins = {"*"})
public class FloorController {
    @Autowired
    private FloorService floorService;

    @GetMapping("/{idFloor}")    // -> este metodo ya se utiliza en conjunto con User
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findById(@PathVariable("idFloor") long idFloor){
        return floorService.findById(idFloor);
    }

    @GetMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> getAllFloors() {
        return floorService.findAllFloors();
    }

    @PostMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> addFloor(@RequestBody Floor floor){
        return  floorService.saveFloor(floor);
    }

    @PutMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> updateFloor(@RequestBody Floor floor){
        return floorService.updateFloor(floor);
    }

    // Obtener camas de un piso específico
    @GetMapping("/{idFloor}/beds")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> getBedsByFloorId(@PathVariable long idFloor) {
        return floorService.getBedsByFloorId(idFloor);
    }

    @GetMapping("/{idFloor}/nurses")
    @Secured({"ROLE_ADMIN", "ROLE_SECRETARY"})
    public ResponseEntity<?> getNursesByFloorId(@PathVariable("idFloor") long idFloor) {
        return floorService.getNursesByFloorId(idFloor);
    }

}
