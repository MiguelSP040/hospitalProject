package utez.edu.mx.hospital.modules.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    //Traer todos los usuarios
    @GetMapping("")
    public ResponseEntity<?> findAll(){
        return userService.findAll();
    }
    //traer por el rol de los usuarios
    @GetMapping("/rol/{idRole}")
    public ResponseEntity<?> findAllByIdRol(@PathVariable("idRole") int idRole){
        return userService.findAllByIdRol(idRole);
    }

    //traer por el id de usuario
    @GetMapping("/{idUser}")
    public ResponseEntity<?> findById(@PathVariable("idUser") long idUser){
        return userService.findById(idUser);
    }

    //guardar usuario
    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody User user){
        return userService.save(user);
    }

    //actualizar usuario
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody User user){
        return userService.update(user);
    }

    //eliminar usuario
    @DeleteMapping("")
    public ResponseEntity<?> deleteById(@RequestBody User user){
        return userService.deleteById(user);
    }
}
