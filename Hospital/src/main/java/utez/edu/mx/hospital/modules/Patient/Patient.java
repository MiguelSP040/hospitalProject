package utez.edu.mx.hospital.modules.Patient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.hospital.modules.Bed.Bed;

@Entity
@Table(name = "Patient")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "full_name", nullable = false)
    private String identificationName;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "lastname")
    private String lastname;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "assignment_date")
    private String assignmentDate;

    @Column(name = "is_discharged")
    private boolean isDischarged;

    @OneToOne(mappedBy = "patient")
    @JsonIgnore
    private Bed bed;

    public Patient() {
    }

    public Patient(String identificationName, String surname, String lastname, String phoneNumber, String assignmentDate, boolean isDischarged) {
        this.identificationName = identificationName;
        this.surname = surname;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.assignmentDate = assignmentDate;
        this.isDischarged = isDischarged;
    }

    public Patient(long id, String identificationName, String surname, String lastname, String phoneNumber, String assignmentDate, boolean isDischarged) {
        this.id = id;
        this.identificationName = identificationName;
        this.surname = surname;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.assignmentDate = assignmentDate;
        this.isDischarged = isDischarged;
    }

    public Patient(String identificationName, String surname, String lastname, String phoneNumber, String assignmentDate, boolean isDischarged, Bed bed) {
        this.identificationName = identificationName;
        this.surname = surname;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.assignmentDate = assignmentDate;
        this.isDischarged = isDischarged;
        this.bed = bed;
    }

    public Patient(long id, String identificationName, String surname, String lastname, String phoneNumber, String assignmentDate, boolean isDischarged, Bed bed) {
        this.id = id;
        this.identificationName = identificationName;
        this.surname = surname;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.assignmentDate = assignmentDate;
        this.isDischarged = isDischarged;
        this.bed = bed;
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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAssignmentDate() {
        return assignmentDate;
    }

    public void setAssignmentDate(String assignmentDate) {
        this.assignmentDate = assignmentDate;
    }

    public boolean isDischarged() {
        return isDischarged;
    }

    public void setDischarged(boolean discharged) {
        isDischarged = discharged;
    }

    public Bed getBed() {
        return bed;
    }

    public void setBed(Bed bed) {
        this.bed = bed;
    }
}
