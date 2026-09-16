package tn.tunisair.workfow.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.tunisair.workfow.Entities.Incident;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Entities.StatutIncident;
import tn.tunisair.workfow.Entities.User;

import java.util.Date;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Integer> {
    List<Incident> findByStatutIncident(StatutIncident statutIncident);

    List<Incident> findByCategorie(String categorie);

    @Query("SELECT i FROM Incident i WHERE i.archived = true")
    List<Incident> findByArchivedTrue();

    @Query("SELECT i FROM Incident i WHERE i.statutIncident = ?1 AND i.dateResolution BETWEEN ?2 AND ?3")
    List<Incident> findByStatutIncidentAndDateResolutionBetween(StatutIncident statut, Date startDate, Date endDate);


    @Query(value = "SELECT categorie, COUNT(*) FROM Incident GROUP BY categorie")
    List<Object[]> countByCategory();

    List<Incident> findByUser(User user);
    @Query("SELECT i FROM Incident i WHERE i.archived = false")

    List<Incident> findByArchivedFalse();
}


