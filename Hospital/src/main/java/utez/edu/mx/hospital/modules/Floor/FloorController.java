package utez.edu.mx.hospital.modules.Floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.hospital.modules.Bed.BedService;

@RestController
@RequestMapping("/api/floor")
public class FloorController {
    @Autowired
    private FloorService floorService;

    @GetMapping("/{idFloor}")    // -> este metodo ya se utiliza en conjunto con User
    public ResponseEntity<?> findById(@PathVariable("idFloor") long idFloor){
        return floorService.findById(idFloor);
    }
}
