package utez.edu.mx.hospital.modules.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.Bed.BedRepository;
import utez.edu.mx.hospital.modules.Floor.Floor;
import utez.edu.mx.hospital.modules.Floor.FloorRepository;
import utez.edu.mx.hospital.modules.User.DTO.UserDTO;
import utez.edu.mx.hospital.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    public UserDTO transformUserToDTO(User u){
        return new UserDTO(
                u.getId(),
                u.getIdentificationName(),
                u.getUsername(),
                u.getSurname(),
                u.getLastname(),
                u.getEmail(),
                u.getPhoneNumber(),
                u.getRole(),
                u.getBeds(),
                u.getNurseInFloor()
        );
    }

    //metodo para buscar todos los usuarios
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List<UserDTO> list = new ArrayList<>();
        String message = "";
        if(userRepository.findAll().isEmpty()){
            message = "Aún no hay registros";
        }else{
            message = "Operación exitosa";
            for(User u: userRepository.findAll()){
                list.add(transformUserToDTO(u));
            }
        }
        return customResponseEntity.getOkResponse(message, "OK", 200, list);
    }

    //metodo que trae usuario por rol
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllByIdRol(int idRole){
        List<UserDTO> list = new ArrayList<>();
            String message = "";
            if(userRepository.findAllByIdRol(idRole).isEmpty()){
                message = "Aún no hay registros";
            }else{
                message = "Operacion exitosa";
                for(User u: userRepository.findAllByIdRol(idRole)){
                    list.add(transformUserToDTO(u));
                }
            }
            return customResponseEntity.getOkResponse(message, "OK", 200, list);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long idUser){
        UserDTO dto = null;
        User found = userRepository.findById(idUser);
        String message = "";
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            message = "Operacion exitosa";
            dto = transformUserToDTO(found);
        }
        return customResponseEntity.getOkResponse(message, "OK", 200, dto);
    }

    //guardar cualquier tipo de user con atributos generales
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> save(User user) {
        try {
            /*if (user.getRole().getId() == 3) {
                // Obtenemos el piso directamente (puede devolver null si no se encuentra)
                Floor foundFloor = floorRepository.findById(user.getSecretary_in_charge().getId());
                if (foundFloor != null ) {
                    user.setSecretary_in_charge(foundFloor);
                }
            }*/
            userRepository.save(user);
            return customResponseEntity.getOkResponse(
                    "Registro exitoso",
                    "OK",
                    201,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }
    }

    //metodo para que secretary asigne una bed a nurse
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> insertBedNurse(User user) {
        User userFound = userRepository.findById(user.getId());
        if(userFound == null){
            return customResponseEntity.get404Response();
        }
        List<Bed> beds = new ArrayList<>();
        for(Bed b: user.getBeds()){
            if(bedRepository.findById(b.getId())==null){
                return customResponseEntity.get404Response();
            }else{
                beds.add(b);
            }
        }
        userFound.setBeds(beds);
        user = userFound;
        try {
            userRepository.save(user);
            return customResponseEntity.getOkResponse(
                    "Actualización exitosa",
                    "OK",
                    200,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }
    }

    //metodo para que secretary asigne floor a nurse
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> insertNurseInFloor(User user) {
        User userFound = userRepository.findById(user.getId());
        if (userFound == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                if (user.getRole().getId() == 1) {
                    // Obtenemos el piso directamente (puede devolver null si no se encuentra)
                    Floor foundFloor = floorRepository.findById(user.getNurseInFloor().getId()); // Usa getNurse().getId() para obtener el ID del Floor asociado a nurse
                    if (foundFloor != null ) {
                        user.setNurseInFloor(foundFloor); // Asigna el objeto Floor completo al atributo nurse
                    }
                }
                userFound.setNurseInFloor(user.getNurseInFloor());
                user = userFound;
                userRepository.save(user);
                return customResponseEntity.getOkResponse(
                        "Enfermera con piso asignado de forma exitosa",
                        "OK",
                        200,
                        null
                );
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }

    //metodo para actualizar cualquier tipo de user
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> update(User user) {
        User found = userRepository.findById(user.getId());
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                user.setPassword(found.getPassword());
                user.setBeds(found.getBeds());
                user.setNurseInFloor(found.getNurseInFloor());
                user.setRole(found.getRole());
                userRepository.save(user);
                return customResponseEntity.getOkResponse(
                        "Actualización exitosa",
                        "OK",
                        200,
                        null
                );
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }


    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> deleteById(User user){
        if (userRepository.findById(user.getId()) == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                if (user.getRole().getId() == 3 && floorRepository.existsBySecretary(user)) {
                    return customResponseEntity.getOkResponse("Error, secretaria asignada a un piso", "OK", 200, null);
                }
                if (user.getRole().getId() == 1) {
                    // Verifica si tiene camas asociadas en la base de datos
                    long assignedBedsCount = bedRepository.countByUsers(user);
                    if (assignedBedsCount > 0) {
                        return customResponseEntity.getOkResponse("Error, enfermera asignada a camas", "OK", 200, null);
                    }
                }
                userRepository.deleteById(user.getId());
                return customResponseEntity.getOkResponse("Eliminación exitosa", "OK", 200, null);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }

}
