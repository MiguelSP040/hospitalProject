package utez.edu.mx.hospital.modules.Bed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.hospital.modules.User.User;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    long countByUsers(User user);  // método para contar camas que tiene nurse
}
