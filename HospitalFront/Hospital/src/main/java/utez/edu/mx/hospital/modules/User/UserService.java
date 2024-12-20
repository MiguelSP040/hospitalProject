package utez.edu.mx.hospital.modules.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.Bed.BedDTO.BedDTO;
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
                transformBedsDTO(u.getBeds()),
                u.getNurseInFloor() != null ? new Floor(u.getNurseInFloor().getId(), u.getNurseInFloor().getIdentificationName(), null, null, null) : null
        );
    }

    public UserDTO transformUserDTO(User u){
        return new UserDTO(
                u.getId(),
                u.getIdentificationName(),
                u.getUsername(),
                u.getSurname(),
                u.getLastname(),
                u.getEmail(),
                u.getPhoneNumber(),
                u.getRole()
        );
    }



    public BedDTO transformBedToDTO(Bed b){
        return new BedDTO(
                b.getId(),
                b.getIdentificationName(),
                b.getIsOccupied(),
                b.getPatient()
        );
    }

    public List<BedDTO> transformBedsDTO(List<Bed> beds){
        List<BedDTO> bedDTOs = new ArrayList<>();
        for(Bed b : beds){
            bedDTOs.add(transformBedToDTO(b));
        }
        return bedDTOs;
    }


    public List<UserDTO> transformUsersDTO(List<User> users){
        List<UserDTO> userDTOs = new ArrayList<>();
        for(User u : users){
            userDTOs.add(transformUserToDTO(u));
        }
        return userDTOs;
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
            List<User> found = userRepository.findAll();
            for (User u : found) {
                if (user.getUsername().equals(u.getUsername())) {
                    return customResponseEntity.get400Response();
                }
            }
            user.setPassword(user.getIdentificationName());
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
    public ResponseEntity<?> insertBedNurse(User user) {
        User userFound = userRepository.findById(user.getId());
        if (userFound == null) {
            return customResponseEntity.get404Response();
        }
        try {
            List<Bed> beds = new ArrayList<>();
            for (Bed b : user.getBeds()) {
                Bed bedFound = bedRepository.findById(b.getId());
                if (bedFound == null) {
                    return customResponseEntity.get404Response();
                } else {
                    bedFound.setHasNurse(!bedFound.getHasNurse());
                    userRepository.insertBeds(user.getId(), b.getId());
                }
            }
            bedRepository.saveAll(beds);  // Guardar todas las camas modificadas
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

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> changeBedNurse(User user) {
        // Verificar si el usuario existe
        User userFound = userRepository.findById(user.getId());
        if (userFound == null) {
            return customResponseEntity.get404Response();
        }

        try {
            for (Bed b : user.getBeds()) {
                // Verificar si la cama existe
                Bed bedFound = bedRepository.findById(b.getId());
                if (bedFound == null) {
                    return customResponseEntity.get404Response();
                }

                // Marcar la cama como ocupada y actualizar la relación
                bedFound.setHasNurse(true);
                userRepository.changeBeds(user.getId(), b.getId());
            }

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
                user.setRole(found.getRole());
                user.setNurseInFloor(found.getNurseInFloor());
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
    public ResponseEntity<?> deleteById(long idUser){
        User userFound = userRepository.findById(idUser);
        if (userFound == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                if (userFound.getRole().getId() == 3 && floorRepository.existsBySecretary(userFound)) {
                    return customResponseEntity.get400Response();
                }
                if (userFound.getRole().getId() == 1) {
                    // Verifica si tiene camas asociadas en la base de datos
                    long assignedBedsCount = bedRepository.countByUsers(userFound);
                    if (assignedBedsCount > 0) {
                        return customResponseEntity.get400Response();
                    }
                }
                userRepository.deleteById(userFound.getId());
                return customResponseEntity.getOkResponse("Eliminación exitosa", "OK", 200, null);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }

    //lista de secretarias sin piso
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllSecretariesWithoutFloor() {
        List<User> listSecretaries = userRepository.findSecretariesWithoutFloor();
        List<UserDTO> listSecretariesDTO = new ArrayList<>();
        for (User user : listSecretaries) {
            listSecretariesDTO.add(transformUserToDTO(user));
        }
        if (listSecretariesDTO.isEmpty()) {
            return customResponseEntity.get404Response();
        } else {
            return customResponseEntity.getOkResponse("Operación exitosa", "OK", 200, listSecretariesDTO);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> changeFloorNurse(long idUser, long idFloor) {
        User userFound = userRepository.findById(idUser);
        if (userFound == null) {
            return customResponseEntity.get404Response();
        }

        // Verifica que el usuario tiene un piso asignado
        Floor currentFloor = userFound.getNurseInFloor();
        if (currentFloor == null) {
            return customResponseEntity.get400Response();
        }
        // Verifica si el piso nuevo existe
        Floor newFloor = floorRepository.findById(idFloor); // Asumiendo que tienes un repositorio de pisos
        if (newFloor == null) {
            return customResponseEntity.get404Response(); // Piso no encontrado
        }
        try{
            if(userFound.getBeds().isEmpty()){
                userFound.setNurseInFloor(newFloor); // Cambia el piso de la enfermera
                userRepository.save(userFound); // Guarda la actualización

                return customResponseEntity.getOkResponse(
                        "Cambio de piso realizado con éxito",
                        "OK",
                        200,
                        null
                );
            }else{
                return customResponseEntity.get400Response();
            }

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }

    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> updatePassword(UserDTO user) {
        if(userRepository.findById(user.getId())==null){
            return customResponseEntity.get404Response();
        }else{
            try{

                if (userRepository.findById(user.getId()).getPassword().equals(user.getOldPassword())) {
                    userRepository.updatePassword(user.getNewPassword(), user.getId(), user.getOldPassword());
                    return customResponseEntity.getOkResponse(
                            "Actualización exitosa",
                            "OK",
                            200,
                            null
                    );
                }else{
                    return customResponseEntity.get400Response();
                }
            } catch (Exception e){
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }


    public ResponseEntity<?> findFloorNameBySecretary(long idUser) {
        String floorName = null;
        String message = "";

        String foundFloorName = userRepository.findFloorNameBySecretary(idUser);

        if (foundFloorName == null) {
            return customResponseEntity.get404Response();
        } else {
            floorName = foundFloorName;
            message = "Operación exitosa";
        }

        return customResponseEntity.getOkResponse(message, "OK", 200, floorName);
    }

    @Transactional(readOnly = true)
    public ResponseEntity findByUsername(String username) {
        UserDTO dto = null;
        User found = userRepository.findByUsername(username);
        String message = "";
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            message = "Operación exitosa";
            dto = transformUserDTO(found);
        }
        return customResponseEntity.getOkResponse(message, "OK", 200, dto);
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> updateUserInfo(UserDTO user) {
        if(userRepository.findById(user.getId())==null){
            return customResponseEntity.get404Response();
        }else{
            try{
                userRepository.updateUserInfo(user.getIdentificationName(),user.getSurname(),user.getLastname(),user.getEmail(), user.getPhoneNumber(), user.getId());
                return customResponseEntity.getOkResponse(
                        "Actualización exitosa",
                        "OK",
                        200,
                        null
                );
            } catch (Exception e){
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> updateNurse(User user) {
        User found = userRepository.findById(user.getId());
        if (found != null) {
            if(found.getBeds().isEmpty()){
                try {
                    userRepository.updateNurse(user.getIdentificationName(), user.getSurname(), user.getLastname(), user.getEmail(), user.getPhoneNumber(), user.getNurseInFloor().getId(), user.getId());
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

            }else if(!(found.getBeds().isEmpty()) && found.getNurseInFloor().getId() ==  user.getNurseInFloor().getId()){
                try {
                    user.setPassword(found.getPassword());
                    user.setBeds(found.getBeds());
                    user.setRole(found.getRole());
                    user.setNurseInFloor(found.getNurseInFloor());
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
            }else{
                return customResponseEntity.get400Response();
            }
        }else{
            return customResponseEntity.get404Response();
        }
    }

}