package utez.edu.mx.hospital.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospital.auth.DTO.AuthLoginDTO;
import utez.edu.mx.hospital.modules.User.User;
import utez.edu.mx.hospital.modules.User.UserDetailsImpl;
import utez.edu.mx.hospital.modules.User.UserRepository;
import utez.edu.mx.hospital.utils.CustomResponseEntity;
import utez.edu.mx.hospital.utils.security.JWTUtil;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Autowired
    private JWTUtil jwtUtil;

    @Transactional(readOnly = true)
    public ResponseEntity<?> login(AuthLoginDTO authLoginDTO) {
        User found = userRepository.findByPasswordAndEmailOrUsername(
                authLoginDTO.getPassword(),
                authLoginDTO.getUser()
        );
        if (found == null) {
            return customResponseEntity.get404Response();
        }else {
            try{
                UserDetails userDetails = new UserDetailsImpl(found);
                return customResponseEntity.getOkResponse(
                        "Inicio de sesión exitoso",
                        "OK",
                        200,
                        jwtUtil.generateToken(userDetails)
                );
            }catch (Exception e) {
                System.out.println(e.getMessage());
                e.printStackTrace();
                return customResponseEntity.get400Response();
            }
        }
    }
}
