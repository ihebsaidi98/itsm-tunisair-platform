package tn.tunisair.workfow.Interfaces;

import org.springframework.web.multipart.MultipartFile;
import tn.tunisair.workfow.Entities.EvenementIncident;
import tn.tunisair.workfow.Entities.Incident;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Entities.StatutIncident;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface IncidentInterface {
     Incident ajouterIncident(Incident incident, MultipartFile fichier,Long Id) ;
    Incident findIncidentById(Integer id);
    List<Incident> findAllIncidents();
    List<Incident> findAllTypesIncidents();
    List<Incident> getAllIncidentsWithUser(Long id);
    void deleteIncident(Integer id);
    Incident updateIncident(Integer id, Incident incidentDetails,MultipartFile fichier);
    void archiveResolvedIncidents();
    List<Incident> getIncidentsByStatut(StatutIncident statut);
    List<Incident> getIncidentsByCategory(String categorie);
    List<Incident> getAllArchivedIncidents();
    List<Incident> getResolvedIncidentsWithinDateRange(Date startDate, Date endDate);
    Map<String, Long> countIncidentsByCategory();
    void processIncidentState(Integer incidentId, EvenementIncident event);
    void closeIncident(Integer id);
     void startWorkOnIncident(Integer id) ;

    Incident AffectPeople(Integer problemId, Integer[] idUsers);

    void notifyPeople(Integer id ,List<String> emails);

    List<Incident> getIncidentsByArchivedTrue();

    Incident archiveIncident(Integer id);

    Incident UnarchiveIncident(Integer id);



    }
