package utez.edu.mx.hospital.modules.Floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping("/{idFloor}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")// -> este metodo ya se utiliza en conjunto con User
    public ResponseEntity<?> findById(@PathVariable("idFloor") long idFloor){
        return floorService.findById(idFloor);
    }

    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllFloors() {
        return floorService.findAllFloors();
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> addFloor(@RequestBody Floor floor){
        return  floorService.saveFloor(floor);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateFloor(@RequestBody Floor floor){
        return floorService.updateFloor(floor);
    }

    // Obtener camas de un piso específico
    @GetMapping("/beds/{idFloor}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getBedsByFloorId(@PathVariable long idFloor) {
        return floorService.getBedsByFloorId(idFloor);
    }

    @GetMapping("/nurses/{idFloor}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> getNursesByFloorId(@PathVariable("idFloor") long idFloor) {
        return floorService.getNursesByFloorId(idFloor);
    }

}
