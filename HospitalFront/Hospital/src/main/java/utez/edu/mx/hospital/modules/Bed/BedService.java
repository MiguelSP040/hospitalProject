package utez.edu.mx.hospital.modules.Bed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.modules.Bed.BedDTO.BedDTO;
import utez.edu.mx.hospital.modules.Floor.Floor;
import utez.edu.mx.hospital.modules.User.UserService;
import utez.edu.mx.hospital.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class BedService {
    @Autowired
    private UserService userService;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    public BedDTO transformBedToDTO(BedDTO b){
        return new BedDTO(
                b.getId(),
                b.getIdentificationName(),
                b.isOccupied(),
                b.getHasNurse(),
                b.getFloor(),
                b.getPatient(),
                userService.transformUserToDTO(b.getUsers())
        );
    }

    
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List<BedDTO> list= new ArrayList<>();
        String message="";
        if(bedRepository.findAll().isEmpty()){
            message="Aún no hay registros";
        } else{
            for (Bed bd: bedRepository.findAll()){
                list.add(transformBedToDTO(b));
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
                list.add(transformBedToDTO(b));
            }
            message="Operacion exitosa";
        }
        return customResponseEntity.getOkResponse(message, "OK", 200, list);
    }

    //Encontrar las camas que no tengan una enfermera asignada por piso
    @Transactional(readOnly = true)
    public ResponseEntity<?> findBedsWithoutNurseInFloor(long idFloor) {
        try {
            List<BedDTO> bedsWithoutNurse = bedRepository.findBedsWithoutNurseInFloor(idFloor);
            if (bedsWithoutNurse.isEmpty()) {
                return customResponseEntity.get404Response();
            }
            return customResponseEntity.getOkResponse("Operación exitosa", "OK", 200, bedsWithoutNurse
            );
        } catch (Exception e) {
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }
}