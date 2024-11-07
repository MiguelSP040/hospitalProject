package utez.edu.mx.hospital.modules.Floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.utils.CustomResponseEntity;

@Service
public class FloorService {
    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long idFloor){ //  // -> este metodo ya se utiliza en conjunto con User
        Floor found = floorRepository.findById(idFloor);
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            return customResponseEntity.getOkResponse("Operación exitosa", "OK", 200, found);
        }

    }
}
