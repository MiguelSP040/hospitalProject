package utez.edu.mx.hospital.modules.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.hospital.modules.Bed.Bed;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"*"})
public class UserController {
    @Autowired
    private UserService userService;

    //Traer todos los usuarios
    @GetMapping("")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findAll(){
        return userService.findAll();
    }

    //traer por el rol de los usuarios
    @GetMapping("/rol/{idRole}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> findAllByIdRol(@PathVariable("idRole") int idRole){
        return userService.findAllByIdRol(idRole);
    }

    //traer por el id de usuario
    @GetMapping("/{idUser}")
    @Secured({"ROLE_ADMIN", "ROLE_SECRETARY"})
    public ResponseEntity<?> findById(@PathVariable("idUser") long idUser){
        return userService.findById(idUser);
    }

    //guardar usuario
    @PostMapping("")
    @Secured({"ROLE_ADMIN", "ROLE_SECRETARY"})
    public ResponseEntity<?> save(@RequestBody User user){
        return userService.save(user);
    }

    //actualizar usuario
    @PutMapping("")
    @Secured({"ROLE_ADMIN", "ROLE_SECRETARY"})
    public ResponseEntity<?> update(@RequestBody User user){
        return userService.update(user);
    }

    //secretary asigna camas a nurse
    @PutMapping("/beds")
    @Secured({"ROLE_SECRETARY"})
    public ResponseEntity<?> insertBedNurse(@RequestBody User user){
        return userService.insertBedNurse(user);
    }

    //secretary asigna floor a nurse
    @PutMapping("/nurseInFloor")
    @Secured({"ROLE_SECRETARY"})
    public ResponseEntity<?> insertNurseInFloor(@RequestBody User user){
        return userService.insertNurseInFloor(user);
    }

    //eliminar usuario
    @DeleteMapping("/delete/{idUser}")
    @Secured({"ROLE_ADMIN", "ROLE_SECRETARY"})
    public ResponseEntity<?> deleteById(@PathVariable("idUser") long idUser){
        return userService.deleteById(idUser);
    }

    @GetMapping("/withoutFloor")
    @Secured("ROLE_SECRETARY")
    public ResponseEntity<?> findAllSecretariesWithoutFloor(){
        return userService.findAllSecretariesWithoutFloor();
    }

    //cambiar el piso de la enfermera
    @PutMapping("/changeFloorNurse/{idUser}/{idFloor}")
    public ResponseEntity<?> changeFloorNurse(@PathVariable("idUser") long idUser, @PathVariable("idFloor") long idFloor) {
        return userService.changeFloorNurse(idUser, idFloor);
    }
}