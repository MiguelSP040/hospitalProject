package utez.edu.mx.hospital.modules.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/role")
@CrossOrigin(origins = {"*"})
public class RoleController {
    @Autowired
    private RoleService roleService;

    @GetMapping("")
    public ResponseEntity<?> findAll(){
        return roleService.findAll();
    }
}
