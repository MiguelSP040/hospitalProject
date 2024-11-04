package utez.edu.mx.hospital.modules.Bed;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.hospital.modules.Floor.Floor;
import utez.edu.mx.hospital.modules.Patient.Patient;
import utez.edu.mx.hospital.modules.User.User;

import java.util.List;

@Entity
@Table(name = "Bed")
public class Bed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "identification_name", nullable = false)
    private String identificationName;

    @Column(name = "is_occupied", nullable = false)
    private boolean isOccupied;

    @ManyToOne
    @JoinColumn(name = "id_floor")
    private Floor floor;

    @OneToOne
    @JoinColumn(name = "id_patient", referencedColumnName = "id", unique = true, nullable = true)
    private Patient patient;

    @ManyToMany(mappedBy = "beds")
    @JsonIgnore
    private List<User> users;



}
