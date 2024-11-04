package utez.edu.mx.hospital.modules.User;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.Floor.Floor;
import utez.edu.mx.hospital.modules.Role.Role;

import java.util.List;

@Entity
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "full_name", nullable = false)
    private String identificationName;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "lastname")
    private String lastname;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "id_role", nullable = false)
    private Role role;

    @ManyToMany
    @JoinTable(
            name = "user_has_beds",
            joinColumns = @JoinColumn(name = "id_user", nullable = true),
            inverseJoinColumns = @JoinColumn(name = "id_bed", nullable = true)
    )
    private List<Bed> beds;

    @ManyToOne
    @JoinColumn(name = "nurse_in_floor", nullable = true)
    private Floor nurse;

    @OneToOne(mappedBy = "secretary")
    @JsonIgnore
    private Floor secretary_in_charge;

    public User() {
    }

    public User(String identificationName, String username, String surname, String lastname, String email, String password, String phoneNumber) {
        this.identificationName = identificationName;
        this.username = username;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    public User(long id, String identificationName, String username, String surname, String lastname, String email, String password, String phoneNumber) {
        this.id = id;
        this.identificationName = identificationName;
        this.username = username;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    public User(String identificationName, String username, String surname, String lastname, String email, String password, String phoneNumber, Role role, List<Bed> beds, Floor nurse, Floor secretary_in_charge) {
        this.identificationName = identificationName;
        this.username = username;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.beds = beds;
        this.nurse = nurse;
        this.secretary_in_charge = secretary_in_charge;
    }

    public User(long id, String identificationName, String username, String surname, String lastname, String email, String password, String phoneNumber, Role role, List<Bed> beds, Floor nurse, Floor secretary_in_charge) {
        this.id = id;
        this.identificationName = identificationName;
        this.username = username;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.beds = beds;
        this.nurse = nurse;
        this.secretary_in_charge = secretary_in_charge;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Bed> getBeds() {
        return beds;
    }

    public void setBeds(List<Bed> beds) {
        this.beds = beds;
    }

    public Floor getNurse() {
        return nurse;
    }

    public void setNurse(Floor nurse) {
        this.nurse = nurse;
    }

    public Floor getSecretary_in_charge() {
        return secretary_in_charge;
    }

    public void setSecretary_in_charge(Floor secretary_in_charge) {
        this.secretary_in_charge = secretary_in_charge;
    }
}
