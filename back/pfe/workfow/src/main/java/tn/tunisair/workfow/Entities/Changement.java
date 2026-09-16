package tn.tunisair.workfow.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
public class Changement implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    String description;
    @Enumerated(EnumType.STRING)
    StatutChangement statutChangement;
    @Enumerated(EnumType.STRING)
    EvenementChangement evenementChangement;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    Date dateCreation;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    Date dateDebutPrevu;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    Date dateFinPrevu;
    String priorite;
    String categorie;
    String commentaire;
    String filename;
    String encodedfilename;
    String motif;
    String etapesMiseEnOeuvre;
    String actionsCorrectives;
    String evaluationRisques;
    String impactUtilisateurs;
    String historiqueModifications;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User responsable;


    @ManyToOne
    @JoinColumn(name = "incident_id")
    private Incident incident;

    @ManyToOne
    @JoinColumn(name = "probleme_id")
    private Probleme probleme;
}
