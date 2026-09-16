package tn.tunisair.workfow.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
public class Probleme implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    String description;
    String impact;
    @Enumerated(EnumType.STRING)
    StatutProbleme statutProbleme;
    @Enumerated(EnumType.STRING)
    Priorite priorite;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    Date dateCreation;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    Date dateResolution;
    String filename;
    String encodedfilename;
    boolean archived;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    private List<User> affectedUsers;

    @OneToMany(mappedBy = "probleme", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Changement> changements;


}
