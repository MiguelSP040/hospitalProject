package utez.edu.mx.hospital.modules.Floor.DTO;

import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.User.DTO.UserDTO;

import java.util.List;

public class FloorDTO {

    private long id;
    private String identificationName;
    private List<Bed> beds;
    private List<UserDTO> nurses;
    private UserDTO secretary;

    public FloorDTO() {
    }

    public FloorDTO(long id) {
        this.id = id;
    }

    public FloorDTO(long id, String identificationName) {
        this.id = id;
        this.identificationName = identificationName;
    }

    public FloorDTO(long id, String identificationName, List<Bed> beds, List<UserDTO> nurses, UserDTO secretary) {
        this.id = id;
        this.identificationName = identificationName;
        this.beds = beds;
        this.nurses = nurses;
        this.secretary = secretary;
    }

    public FloorDTO(long id, String identificationName, List<Bed> beds, UserDTO secretary) {
        this.id = id;
        this.identificationName = identificationName;
        this.beds = beds;
        this.secretary = secretary;
    }

    public FloorDTO(long id, String identificationName, UserDTO secretary) {
        this.id = id;
        this.identificationName = identificationName;
        this.secretary = secretary;
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

    public List<Bed> getBeds() {
        return beds;
    }

    public void setBeds(List<Bed> beds) {
        this.beds = beds;
    }

    public List<UserDTO> getNurses() {
        return nurses;
    }

    public void setNurses(List<UserDTO> nurses) {
        this.nurses = nurses;
    }

    public UserDTO getSecretary() {
        return secretary;
    }

    public void setSecretary(UserDTO secretary) {
        this.secretary = secretary;
    }
}