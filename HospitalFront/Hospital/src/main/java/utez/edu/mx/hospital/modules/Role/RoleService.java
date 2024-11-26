package utez.edu.mx.hospital.modules.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.utils.CustomResponseEntity;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll() {
        List<Role> roles = roleRepository.findAll();
        return customResponseEntity.getOkResponse("Operacion exitosa", "OK", 200, roles);
    }
}
