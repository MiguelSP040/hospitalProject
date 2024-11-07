package utez.edu.mx.hospital.modules.Floor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.User.User;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Long> {
    Floor findById(long idFloor);   // -> este método ya se utiliza en conjunto con User

    boolean existsBySecretary(User user);  // método para verificar si un usuario es secretario en algún piso
}
