package utez.edu.mx.hospital.modules.Floor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.hospital.modules.Bed.Bed;
import utez.edu.mx.hospital.modules.User.User;

import java.util.List;

@Entity
@Table(name = "floor")
public class Floor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "identification_name", nullable = false)
    private String identificationName;

    @OneToMany(mappedBy = "floor")
    @JsonIgnore
    private List<Bed> beds;

    @OneToMany(mappedBy = "nurseInFloor")  // -> nombre actualizado
    @JsonIgnore
    private List<User> nurses;

    @OneToOne
    @JoinColumn(name = "secretary_in_charge", nullable = false, unique = true)
    private User secretary;

    public Floor() {
    }

    public Floor(String identificationName) {
        this.identificationName = identificationName;
    }

    public Floor(long id, String identificationName) {
        this.id = id;
        this.identificationName = identificationName;
    }

    public Floor(String identificationName, List<Bed> beds, List<User> nurses, User secretary) {
        this.identificationName = identificationName;
        this.beds = beds;
        this.nurses = nurses;
        this.secretary = secretary;
    }

    public Floor(long id, String identificationName, List<Bed> beds, List<User> nurses, User secretary) {
        this.id = id;
        this.identificationName = identificationName;
        this.beds = beds;
        this.nurses = nurses;
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

    public List<User> getNurses() {
        return nurses;
    }

    public void setNurses(List<User> nurses) {
        this.nurses = nurses;
    }

    public User getSecretary() {
        return secretary;
    }

    public void setSecretary(User secretary) {
        this.secretary = secretary;
    }

    @Override
    public String toString() {
        return "Floor{" +
                "id=" + id +
                ", identificationName='" + identificationName + '\'' +
                ", beds=" + beds +
                ", nurses=" + nurses +
                ", secretary=" + secretary +
                '}';
    }
}
