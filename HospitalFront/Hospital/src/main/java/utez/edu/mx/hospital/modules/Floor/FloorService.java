package utez.edu.mx.hospital.modules.Floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.Bed.BedDTO.BedDTO;
import utez.edu.mx.hospital.modules.Bed.BedRepository;
import utez.edu.mx.hospital.modules.Bed.BedService;
import utez.edu.mx.hospital.modules.Floor.DTO.FloorDTO;
import utez.edu.mx.hospital.modules.User.DTO.UserDTO;
import utez.edu.mx.hospital.modules.User.User;
import utez.edu.mx.hospital.modules.User.UserService;
import utez.edu.mx.hospital.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FloorService {


    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    public BedDTO transformBedToDTO(Bed bed) {
        return new BedDTO(
                bed.getId(),
                bed.getIdentificationName(),
                bed.getIsOccupied(),
                bed.getHasNurse(),
                bed.getFloor() != null ? new FloorDTO(bed.getFloor().getId(), bed.getFloor().getIdentificationName(), null, null, null) : null,
                bed.getPatient() // Se puede transformar si necesitas más detalles.
        );
    }


    public List<BedDTO> transformBedsToDTOs(List<Bed> beds) {
        return beds.stream().map(this::transformBedToDTO).collect(Collectors.toList());
    }

    public List<BedDTO> transformBedsToDTOToDTO(List<Bed> beds) {
        List<BedDTO> bedDTOs = new ArrayList<>();
        for(Bed b : beds){
            bedDTOs.add(transformBedDTOToDTO(b));
        }
        return bedDTOs;
    }

    public BedDTO transformBedDTOToDTO(Bed bed) {
        return new BedDTO(
                bed.getId(),
                bed.getIdentificationName(),
                bed.getIsOccupied(),
                bed.getHasNurse(),
                bed.getPatient()
        );
    }

    public UserDTO transformUserToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getIdentificationName(),
                user.getUsername(),
                user.getSurname(),
                user.getLastname(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }

    public List<UserDTO> transformUsersToDTOs(List<User> users) {
        return users.stream().map(this::transformUserToDTO).collect(Collectors.toList());
    }



    public FloorDTO transformFloorToDTO(Floor floor) {
        return new FloorDTO(
                floor.getId(),
                floor.getIdentificationName(),
                transformBedsToDTOs(floor.getBeds()),
                transformUsersToDTOs(floor.getNurses()),
                floor.getSecretary() != null ? transformUserToDTO(floor.getSecretary()) : null
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long idFloor) {
        Floor floor = floorRepository.findById(idFloor);
        if (floor == null) {
            return customResponseEntity.get404Response();
        }
        return customResponseEntity.getOkResponse("Operación exitosa", "OK", 200, transformFloorToDTO(floor));
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllFloors() {
        List<Floor> floors = floorRepository.findAll();
        String message = floors.isEmpty() ? "Aún no hay registros de pisos" : "Operación exitosa";
        return customResponseEntity.getOkResponse(message, "OK", 200, floors.stream().map(this::transformFloorToDTO).collect(Collectors.toList()));
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> saveFloor(Floor floor) {
        try {
            floorRepository.save(floor);
            return customResponseEntity.getOkResponse("Registro exitoso", "CREATED", 201, null);
        } catch (Exception e) {
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> updateFloor(Floor floor) {
        if (floorRepository.findById(floor.getId()) == null) {
            return customResponseEntity.get404Response();
        }
        try {
            floorRepository.save(floor);
            return customResponseEntity.getOkResponse("Actualización exitosa", "OK", 200, null);
        } catch (Exception e) {
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getBedsByFloorId(long floorId) {
        Floor floor = floorRepository.findById(floorId);
        if (floor == null) {
            return customResponseEntity.get404Response();
        }
        List<BedDTO> beds = transformBedsToDTOToDTO(floor.getBeds());
        String message = beds.isEmpty() ? "No hay camas asignadas a este piso" : "Operación exitosa";
        return customResponseEntity.getOkResponse(message, "OK", 200, beds);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getNursesByFloorId(long floorId) {
        Floor floor = floorRepository.findById(floorId);
        if (floor == null) {
            return customResponseEntity.get404Response();
        }
        List<UserDTO> nurses = transformUsersToDTOs(floor.getNurses());
        String message = nurses.isEmpty() ? "No hay enfermeras asignadas a este piso" : "Operación exitosa";
        return customResponseEntity.getOkResponse(message, "OK", 200, nurses);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getBedsAndFloorBySecretaryUsername(String username) {
        // Obtener resultados del repository
        List<Map<String, Object>> results = floorRepository.findBedsAndFloorBySecretaryUsername(username);

        // Verificar si los resultados están vacíos
        if (results == null || results.isEmpty()) {
            return customResponseEntity.get404Response();
        }

        // Log para depuración (opcional)
        results.forEach(result -> {
            System.out.println("Resultado: " + result);
        });

        // Construir respuesta exitosa
        String message = "Operación exitosa";
        return customResponseEntity.getOkResponse(message, "OK", 200, results);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getFloorBySecretaryUsername(String username) {
        // Obtener datos del piso mediante el repositorio
        Map<String, String> floorData = floorRepository.findFloorBySecretaryUsername(username);

        // Validar si se encontraron datos
        if (floorData == null || floorData.isEmpty()) {
            return customResponseEntity.get404Response();
        }

        String message = "Operación exitosa";
        return customResponseEntity.getOkResponse(message, "OK", 200, floorData);
    }


}