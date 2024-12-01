package utez.edu.mx.hospital.modules.Bed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.modules.Bed.BedDTO.BedDTO;
import utez.edu.mx.hospital.modules.Floor.DTO.FloorDTO;
import utez.edu.mx.hospital.modules.Floor.Floor;
import utez.edu.mx.hospital.modules.Floor.FloorService;
import utez.edu.mx.hospital.modules.User.DTO.UserDTO;
import utez.edu.mx.hospital.modules.User.User;
import utez.edu.mx.hospital.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BedService {

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    public BedDTO transformBedToDTO(Bed b){
        return new BedDTO(
                b.getId(),
                b.getIdentificationName(),
                b.getIsOccupied(),
                b.getHasNurse(),
                transformBedFloorToDTO(b.getFloor()),
                b.getPatient()
        );
    }

    public BedDTO transformBedToDTOAvailable(Bed b){
        return new BedDTO(
                b.getId(),
                b.getIdentificationName(),
                b.getIsOccupied(),
                b.getHasNurse(),
                transformFloorToDTO(b.getFloor()),
                b.getPatient()
        );
    }

    public UserDTO transformUserToUserDTO(User u){
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

    public List<UserDTO> transformUsersDTO(List<User> users){
        List<UserDTO> userDTOs = new ArrayList<>();
        for(User u : users){
            userDTOs.add(transformUserToUserDTO(u));
        }
        return userDTOs;
    }

    public FloorDTO transformFloorToDTO(Floor floor) {
        return new FloorDTO(
                floor.getId(),
                floor.getIdentificationName()
        );
    }

    public BedDTO transformBedToDTOTODTO(Bed b){
        return new BedDTO(
                b.getId(),
                b.getIdentificationName(),
                b.getIsOccupied(),
                b.getHasNurse(),
                b.getPatient()
        );
    }

    public FloorDTO transformBedFloorToDTO(Floor f){
        return new FloorDTO(
                f.getId(),
                f.getIdentificationName(),
                transformUsersDTO(f.getNurses())
        );
    }

    public List<BedDTO> transformBedsDTO(List<Bed> beds){
        List<BedDTO> bedDTOs = new ArrayList<>();
        for(Bed b : beds){
            bedDTOs.add(transformBedToDTO(b));
        }
        return bedDTOs;
    }
    
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List<BedDTO> list= new ArrayList<>();
        String message="";
        if(bedRepository.findAll().isEmpty()){
            message="Aún no hay registros";
        } else{
            for (Bed bd: bedRepository.findAll()){
                System.out.println(bd.getFloor().getId());
                list.add(transformBedToDTO(bd));
            }
            message="Operación exitosa";
        }
        return customResponseEntity.getOkResponse(message, "OK", 200, list);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long id){
        BedDTO dto = null;
        Bed found = bedRepository.findById(id);
        String message = "";
        if(found == null){
            return customResponseEntity.get404Response();
        } else {
            message = "Operación exitosa";
            dto = transformBedToDTO(found);
        }
        return customResponseEntity.getOkResponse(message, "OK", 200, dto);
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?>save(Bed bed){
        try{
            bedRepository.save(bed);
            return customResponseEntity.getOkResponse("Registro exitoso", "CREATED",200,null);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return customResponseEntity.get400Response();
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?>update(Bed bed){
        Bed found = bedRepository.findById(bed.getId());
        if(found==null){
            return customResponseEntity.get404Response();
        }else {
            try{
                bedRepository.save(bed);
                return customResponseEntity.getOkResponse("Actualizacion exitosa", "Actualizado",200,null);
            }catch (Exception e){
                e.printStackTrace();
                System.out.println(e.getMessage());
                return customResponseEntity.get400Response();
            }
        }
    }

    // Encontrar camas por piso
    @Transactional(readOnly = true)
    public ResponseEntity<?> findByFloor(Floor floor){
        List<BedDTO> list= new ArrayList<>();
        String message="";
        if(bedRepository.findByFloor(floor).isEmpty()){
            message="No se encontraron camas en este piso";
        } else{
            for (Bed b: bedRepository.findByFloor(floor)){
                list.add(transformBedToDTO(b));
            }
            message="Operación exitosa";
        }
        return customResponseEntity.getOkResponse(message, "OK", 200, list);
    }

    // Encontrar camas disponibles en un piso
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAvailableBedsByFloor(long floorId) {
        List<BedDTO> list= new ArrayList<>();
        String message="";
        if(bedRepository.findAvailableBedsByFloor(floorId).isEmpty()){
            message="No se encontraron camas disponibles en este piso";
        } else {
            for (Bed b: bedRepository.findAvailableBedsByFloor(floorId)){
                list.add(transformBedToDTOAvailable(b));
            }
            message="Operacion exitosa";
        }
        return customResponseEntity.getOkResponse(message, "OK", 200, list);
    }

    //Encontrar las camas que no tengan una enfermera asignada por piso
    @Transactional(readOnly = true)
    public ResponseEntity<?> findBedsWithoutNurseInFloor(long idFloor) {
        try {
            List<Bed> bedsWithoutNurse = bedRepository.findBedsWithoutNurseInFloor(idFloor);
            if (bedsWithoutNurse.isEmpty()) {
                return customResponseEntity.get404Response();
            }
            List<BedDTO> bedDTOs = new ArrayList<>();
            for (Bed b: bedsWithoutNurse){
                bedDTOs.add(transformBedToDTOTODTO(b));
            }
            return customResponseEntity.getOkResponse("Operación exitosa", "OK", 200, bedDTOs
            );
        } catch (Exception e) {
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }

    //mostar pisos con camas sin enfermera
    @Transactional(readOnly = true)
    public ResponseEntity<?> findFloorsWithoutNurse() {
        // Obtener las camas asociadas a pisos sin enfermera
        List<Bed> beds = bedRepository.findFloorsWithBedsHasNurseIsNull();
        if (beds.isEmpty()) {
            return customResponseEntity.get404Response();
        } else {
            List<FloorDTO> floorsWithoutNurse = new ArrayList<>();
            for (Bed b : beds) {
                Floor floor = b.getFloor();
                if (floor != null) {
                    floorsWithoutNurse.add(transformFloorToDTO(floor));
                }
            }
            return customResponseEntity.getOkResponse(
                    "Operación exitosa",
                    "OK",
                    200,
                    floorsWithoutNurse
            );
        }
    }

    //cuenta camas vacias por piso
    public ResponseEntity<?> countEmptyBedsInFloor(long idFloor) {
        try{
            // Llama al servicio que usa el método de BedRepository
            long count = bedRepository.countEmptyBedsInFloor(idFloor);
            return customResponseEntity.getOkResponse("Operación exitosa", "OK", 200, count);
        } catch (Exception e) {
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }

}