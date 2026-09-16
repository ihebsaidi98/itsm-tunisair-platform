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
    public class Incident implements Serializable {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Integer id;
        String description;
        String impact;
        String categorie;
        String natureIncident;
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        Date dateCreation;
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        Date dateResolution;
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        Date echeance;
        String historiqueActions;
        @Enumerated(EnumType.STRING)
        StatutIncident statutIncident;
        @Enumerated(EnumType.STRING)
        Priorite priorite;
        @Enumerated(EnumType.STRING)
        EvenementIncident evenementIncident;
        String filename;
        String encodedfilename;
        boolean archived;


        @ManyToOne
        @JoinColumn(name = "user_id")
        private User user;

        @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL)
        @JsonIgnore
        private List<Changement> changements;

        @ManyToMany
        private List<User> affectedUsers;

        public void setArchived(boolean archived) {
            this.archived = archived;
        }
    }
