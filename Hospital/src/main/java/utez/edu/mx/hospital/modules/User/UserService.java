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

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> save(User user) {
        try {
            if (user.getRole().getId() == 1) {
                // Obtenemos el piso directamente (puede devolver null si no se encuentra)
                Floor found = floorRepository.findById(user.getNurseInFloor().getId()); // Usa getNurse().getId() para obtener el ID del Floor asociado a nurse
                if (found != null ) {
                    user.setNurseInFloor(found); // Asigna el objeto Floor completo al atributo nurse
                }
            }
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


    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> update(User user) {
        User found = userRepository.findById(user.getId());
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                if (user.getRole().getId() == 1 && user.getNurseInFloor() != null) {
                    // Verificar si nurseInFloor no es null
                    Floor foundFloor = floorRepository.findById(user.getNurseInFloor().getId());
                    if (foundFloor != null) {
                        user.setNurseInFloor(foundFloor); // Asignar el objeto Floor completo al nurseInFloor
                    }
                }
                user.setPassword(found.getPassword());
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
