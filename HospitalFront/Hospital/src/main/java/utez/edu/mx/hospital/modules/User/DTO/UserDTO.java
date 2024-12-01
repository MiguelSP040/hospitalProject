package utez.edu.mx.hospital.modules.User.DTO;

import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.Bed.BedDTO.BedDTO;
import utez.edu.mx.hospital.modules.Floor.Floor;
import utez.edu.mx.hospital.modules.Role.Role;

import java.util.List;

public class UserDTO {
    private long id;
    private String identificationName, username, surname, lastname, email,phoneNumber;
    private Role role;
    private List<BedDTO> beds;
    private Floor nurseInFloor;

    public UserDTO() {
    }

    public UserDTO(long id, String identificationName, String username, String surname, String lastname, String email, String phoneNumber, Role role, List<BedDTO> beds, Floor nurseInFloor) {
        this.id = id;
        this.identificationName = identificationName;
        this.username = username;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.beds = beds;
        this.nurseInFloor = nurseInFloor;
    }

    public UserDTO(long id, String identificationName, String username, String email) {
        this.id = id;
        this.identificationName = identificationName;
        this.username = username;
        this.email = email;
    }

    public UserDTO(long id, String identificationName, String username, String surname, String lastname, String email, String phoneNumber, Role role) {
        this.id = id;
        this.identificationName = identificationName;
        this.username = username;
        this.surname = surname;
        this.lastname = lastname;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
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

    public List<BedDTO> getBeds() {
        return beds;
    }

    public void setBeds(List<BedDTO> beds) {
        this.beds = beds;
    }

    public Floor getNurseInFloor() {
        return nurseInFloor;
    }

    public void setNurseInFloor(Floor nurseInFloor) {
        this.nurseInFloor = nurseInFloor;
    }
}
