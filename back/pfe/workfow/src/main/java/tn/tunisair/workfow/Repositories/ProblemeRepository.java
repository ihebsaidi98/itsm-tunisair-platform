package tn.tunisair.workfow.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Entities.StatutProbleme;
import tn.tunisair.workfow.Entities.User;

import java.util.Date;
import java.util.List;

@Repository
public interface ProblemeRepository extends JpaRepository<Probleme, Integer> {
    List<Probleme> findByStatutProbleme(StatutProbleme statutProbleme);


    @Query("SELECT i FROM Probleme i WHERE i.statutProbleme = ?1 AND i.dateResolution BETWEEN ?2 AND ?3")
    List<Probleme> findByStatutProblemeAndDateResolutionBetween(StatutProbleme statut, Date startDate, Date endDate);

    List<Probleme> findByUser(User user);

    @Query("SELECT i FROM Probleme i WHERE i.archived = true")


    List<Probleme> findByArchivedTrue();

    @Query("SELECT i FROM Probleme i WHERE i.archived = false")

    List<Probleme> findByArchivedFalse();
}


