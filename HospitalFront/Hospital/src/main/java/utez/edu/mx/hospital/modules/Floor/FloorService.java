package utez.edu.mx.hospital.modules.Floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.Bed.BedDTO.BedDTO;
import utez.edu.mx.hospital.modules.Bed.BedService;
import utez.edu.mx.hospital.modules.Floor.DTO.FloorDTO;
import utez.edu.mx.hospital.modules.User.DTO.UserDTO;
import utez.edu.mx.hospital.modules.User.User;
import utez.edu.mx.hospital.modules.User.UserService;
import utez.edu.mx.hospital.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FloorService {

    @Autowired
    private UserService userService;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    public BedDTO transformBedToDTO(Bed b){
        return new BedDTO(
                b.getId(),
                b.getIdentificationName(),
                b.getIsOccupied(),
                b.getHasNurse(),
                transformFloorToDTO(b.getFloor()),
                b.getPatient()
        );
    }

    public FloorDTO transformFloorToDTO(Floor floor) {
        return new FloorDTO(
                floor.getId(),
                floor.getIdentificationName(),
                userService.transformUserToDTO(floor.getSecretary())

        );
    }

    public FloorDTO transformFloorForBedToDTO(Floor floor) {
        return new FloorDTO(
                floor.getId(),
                floor.getIdentificationName()
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long idFloor) {
        Floor found = floorRepository.findById(idFloor);
        if (found == null) {
            return customResponseEntity.get404Response();
        }
        FloorDTO dto = transformFloorToDTO(found);
        return customResponseEntity.getOkResponse("Operación exitosa", "OK", 200, dto);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllFloors(){
        List<FloorDTO> floors = new ArrayList<>();
        String message = "";
        if(floorRepository.findAll().isEmpty()) {
            message = "Aún no hay registros de pisos";
        } else {
            message = "Operación exitosa";
            for(Floor f: floorRepository.findAll()){
                floors.add(transformFloorToDTO(f));
            }
        }
        return customResponseEntity.getOkResponse(message,"OK", 200, floors);
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> saveFloor(Floor floor) {
        try {
            Floor saved = floorRepository.save(floor);
            return customResponseEntity.getOkResponse(
                    "Registro exitoso",
                    "CREATED",
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
    public ResponseEntity<?> updateFloor(Floor floor){

        if (floorRepository.findById(floor.getId()) == null){
            return customResponseEntity.get404Response();

        } else {
            try {
                floorRepository.save(floor);
                return customResponseEntity.getOkResponse(
                        "Actualizacion exitosa",
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

    // Obtener las camas del piso
    @Transactional(readOnly = true)
    public ResponseEntity<?> getBedsByFloorId(long floorId) {
        Floor floor = floorRepository.findById(floorId);

        if (floor == null) {
            return customResponseEntity.get404Response();
        }

        List<Bed> beds = floor.getBeds();
        String message = beds.isEmpty() ? "No hay camas asignadas a este piso" : "Operación exitosa";
        return customResponseEntity.getOkResponse(message, "OK", 200, beds);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getNursesByFloorId(long floorId) {
        Floor floor = floorRepository.findById(floorId);

        if (floor == null) {
            return customResponseEntity.get404Response();
        }

        // Filtrar los usuarios que tienen el rol de "nurse"
        List<User> nurses = floor.getNurses().stream()
                .filter(user -> user.getRole().getName().equalsIgnoreCase("ROLE_NURSE"))
                .collect(Collectors.toList());

        String message = nurses.isEmpty() ? "No hay enfermeras asignadas a este piso" : "Operación exitosa";
        return customResponseEntity.getOkResponse(message, "OK", 200, nurses);
    }
}