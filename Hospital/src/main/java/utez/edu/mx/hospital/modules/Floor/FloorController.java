package utez.edu.mx.hospital.modules.Floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.hospital.modules.Bed.BedService;
import utez.edu.mx.hospital.modules.User.User;

import java.util.List;

@RestController
@RequestMapping("/api/floor")
public class FloorController {
    @Autowired
    private FloorService floorService;

    @GetMapping("/{idFloor}")    // -> este metodo ya se utiliza en conjunto con User
    public ResponseEntity<?> findById(@PathVariable("idFloor") long idFloor){
        return floorService.findById(idFloor);
    }

    @GetMapping("")
    public ResponseEntity<?> getAllFloors() {
        return floorService.findAllFloors();
    }

    @PostMapping("")
    public ResponseEntity<?> addFloor(@RequestBody Floor floor){
        return  floorService.saveFloor(floor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFloor(@RequestBody Floor floor){
        return floorService.updateFloor(floor);
    }

    // Obtener camas de un piso específico
    @GetMapping("/{idFloor}/beds")
    public ResponseEntity<?> getBedsByFloorId(@PathVariable long idFloor) {
        return floorService.getBedsByFloorId(idFloor);
    }

    @GetMapping("/{idFloor}/nurses")
    public ResponseEntity<?> getNursesByFloorId(@PathVariable("idFloor") long idFloor) {
        return floorService.getNursesByFloorId(idFloor);
    }

}
