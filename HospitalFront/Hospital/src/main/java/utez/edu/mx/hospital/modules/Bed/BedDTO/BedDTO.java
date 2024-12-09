package utez.edu.mx.hospital.modules.Bed.BedDTO;

import utez.edu.mx.hospital.modules.Floor.DTO.FloorDTO;
import utez.edu.mx.hospital.modules.Patient.Patient;
import utez.edu.mx.hospital.modules.User.DTO.UserDTO;

import java.util.List;

public class BedDTO {
    private long id;
    private String identificationName;
    private Boolean isOccupied;
    private Boolean hasNurse;
    private FloorDTO floor;
    private Patient patient;
    private List<UserDTO> nurses;

    public BedDTO() {
    }

    public BedDTO(long id, String identificationName, Boolean isOccupied, Boolean hasNurse, FloorDTO floor, Patient patient, List<UserDTO> nurses) {
        this.id = id;
        this.identificationName = identificationName;
        this.isOccupied = isOccupied;
        this.hasNurse = hasNurse;
        this.floor = floor;
        this.patient = patient;
        this.nurses = nurses;
    }

    public BedDTO(long id, String identificationName, Boolean isOccupied, Patient patient) {
        this.id = id;
        this.identificationName = identificationName;
        this.isOccupied = isOccupied;
        this.patient = patient;
    }

    public BedDTO(long id, String identificationName, Boolean isOccupied, Boolean hasNurse, FloorDTO floor, Patient patient) {
        this.id = id;
        this.identificationName = identificationName;
        this.isOccupied = isOccupied;
        this.hasNurse = hasNurse;
        this.floor = floor;
        this.patient = patient;
    }

    public BedDTO(long id, String identificationName, Boolean isOccupied, Boolean hasNurse, Patient patient) {
        this.id = id;
        this.identificationName = identificationName;
        this.isOccupied = isOccupied;
        this.hasNurse = hasNurse;
        this.patient = patient;
    }

    public BedDTO(long id, String identificationName, FloorDTO floor) {
        this.id = id;
        this.identificationName = identificationName;
        this.floor = floor;
    }

    public BedDTO(long id, String identificationName) {
        this.id = id;
        this.identificationName = identificationName;
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

    public void setIsOccupied(Boolean isOccupied) {
        this.isOccupied = isOccupied;
    }

    public Boolean getHasNurse() {
        return hasNurse != null ? hasNurse : false;
    }

    public void setHasNurse(Boolean hasNurse) {
        this.hasNurse = hasNurse;
    }

    public FloorDTO getFloor() {
        return floor;
    }

    public void setFloor(FloorDTO floor) {
        this.floor = floor;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public List<UserDTO> getNurses() {
        return nurses;
    }

    public void setNurses(List<UserDTO> nurses) {
        this.nurses = nurses;
    }
}
