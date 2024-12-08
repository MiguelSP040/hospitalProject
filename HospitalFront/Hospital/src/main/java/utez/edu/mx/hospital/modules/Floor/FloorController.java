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

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{idFloor}")    // -> este metodo ya se utiliza en conjunto con User
    public ResponseEntity<?> findById(@PathVariable("idFloor") long idFloor){
        return floorService.findById(idFloor);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("")
    public ResponseEntity<?> getAllFloors() {
        return floorService.findAllFloors();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> addFloor(@RequestBody Floor floor){
        return  floorService.saveFloor(floor);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFloor(@RequestBody Floor floor){
        return floorService.updateFloor(floor);
    }

    // Obtener camas de un piso específico
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("/beds/{idFloor}")
    public ResponseEntity<?> getBedsByFloorId(@PathVariable long idFloor) {
        return floorService.getBedsByFloorId(idFloor);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("/nurses/{idFloor}")
    public ResponseEntity<?> getNursesByFloorId(@PathVariable("idFloor") long idFloor) {
        return floorService.getNursesByFloorId(idFloor);
    }

    @GetMapping("/beds-and-floor/{username}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> getBedsAndFloorBySecretaryUsername(@PathVariable("username") String username) {
        return floorService.getBedsAndFloorBySecretaryUsername(username);
    }

    @GetMapping("/floor/{username}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> getFloorBySecretaryUsername(@PathVariable("username") String username) {
        return floorService.getFloorBySecretaryUsername(username);
    }


}
