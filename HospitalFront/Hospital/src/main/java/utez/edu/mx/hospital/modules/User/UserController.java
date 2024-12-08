package utez.edu.mx.hospital.modules.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.User.DTO.UserDTO;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"*"})
public class UserController {
    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("")
    public ResponseEntity<?> findAll(){
        return userService.findAll();
    }

    //traer por el rol de los usuarios
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/rol/{idRole}")
    public ResponseEntity<?> findAllByIdRol(@PathVariable("idRole") int idRole){
        return userService.findAllByIdRol(idRole);
    }

    //traer por el id de usuario
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("/{idUser}")
    public ResponseEntity<?> findById(@PathVariable("idUser") long idUser){
        return userService.findById(idUser);
    }


    //guardar usuario
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody User user){
        return userService.save(user);
    }

    //actualizar usuario
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody User user){
        return userService.update(user);
    }

    //secretary asigna camas a nurse
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    @PutMapping("/beds")
    public ResponseEntity<?> insertBedNurse(@RequestBody User user){
        return userService.insertBedNurse(user);
    }

    //secretary asigna floor a nurse
    @PutMapping("/nurseInFloor")
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    public ResponseEntity<?> insertNurseInFloor(@RequestBody User user){
        return userService.insertNurseInFloor(user);
    }

    //eliminar usuario
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete/{idUser}")
    public ResponseEntity<?> deleteById(@PathVariable("idUser") long idUser){
        return userService.deleteById(idUser);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY')")
    @GetMapping("/withoutFloor")
    public ResponseEntity<?> findAllSecretariesWithoutFloor(){
        return userService.findAllSecretariesWithoutFloor();
    }

    //cambiar el piso de la enfermera
    @PreAuthorize("hasRole('ROLE_SECRETARY')")
    @PutMapping("/changeFloorNurse/{idUser}/{idFloor}")
    public ResponseEntity<?> changeFloorNurse(@PathVariable("idUser") long idUser, @PathVariable("idFloor") long idFloor) {
        return userService.changeFloorNurse(idUser, idFloor);
    }
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SECRETARY') or hasRole('ROLE_NURSE')")
    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody UserDTO user) {
        return userService.updatePassword(user);
    }



}