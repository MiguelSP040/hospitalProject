package utez.edu.mx.hospital.modules.Bed;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @Column(name = "identification_name", nullable = false, unique = true)
    private String identificationName;

    @Column(name = "is_occupied")
    private Boolean isOccupied;

    @Column(name="has_nurse")
    private Boolean hasNurse;

    @ManyToOne
    @JoinColumn(name = "id_floor")
    private Floor floor;

    @OneToOne
    @JoinColumn(name = "id_patient", referencedColumnName = "id", unique = true, nullable = true)
    private Patient patient;

    @ManyToMany(mappedBy = "beds")
    @JsonIgnore
    private List<User> users;

    public Bed() {
    }

    public Bed(String identificationName, Boolean isOccupied, Boolean hasNurse) {
        this.identificationName = identificationName;
        this.isOccupied = isOccupied;
        this.hasNurse = hasNurse;
    }

    public Bed(long id, String identificationName, Boolean isOccupied, Boolean hasNurse) {
        this.id = id;
        this.identificationName = identificationName;
        this.isOccupied = isOccupied;
        this.hasNurse = hasNurse;
    }

    public Bed(String identificationName, Boolean isOccupied, Boolean hasNurse, Floor floor, Patient patient, List<User> users) {
        this.identificationName = identificationName;
        this.isOccupied = isOccupied;
        this.hasNurse = hasNurse;
        this.floor = floor;
        this.patient = patient;
        this.users = users;
    }

    public Bed(long id, String identificationName, Boolean isOccupied, Boolean hasNurse, Floor floor, Patient patient, List<User> users) {
        this.id = id;
        this.identificationName = identificationName;
        this.isOccupied = isOccupied;
        this.hasNurse = hasNurse;
        this.floor = floor;
        this.patient = patient;
        this.users = users;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getIdentificationName() {
        return identificationName;
    }

    public void setIdentificationName(String identificationName) {
        this.identificationName = identificationName;
    }

    public Boolean getIsOccupied() { return isOccupied != null ? isOccupied : false; }

    public void setIsOccupied(Boolean isOccupied) { this.isOccupied = isOccupied; }

    public Boolean getHasNurse() {
        return hasNurse != null ? hasNurse : false;
    }

    public void setHasNurse(Boolean hasNurse) { this.hasNurse = hasNurse; }

    public Floor getFloor() {
        return floor;
    }

    public void setFloor(Floor floor) {
        this.floor = floor;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}