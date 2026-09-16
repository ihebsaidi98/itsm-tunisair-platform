package tn.tunisair.workfow.Interfaces;

import jakarta.mail.MessagingException;
import org.springframework.web.multipart.MultipartFile;
import tn.tunisair.workfow.Entities.Changement;

import java.util.List;

public interface ChangementInterface {
    Changement addChangement(Changement changement,Integer userid ,MultipartFile fichier);

    Changement findChangementById(Integer id);

    List<Changement> findAllChangements();

    void deleteChangement(Integer id);

    Changement updateChangement(Integer id, Changement changementDetails, MultipartFile fichier);

     Changement addChangementToIncident(Integer incidentId, Changement changement) ;

    List<Changement> getAllChangementsByIncidentId(Integer incidentId);

     void deleteChangementFromIncident(Integer incidentId, Integer changementId) ;

    Changement updateChangementInIncident(Integer incidentId, Integer changementId, Changement updatedChangement);

    Changement affecterChangementToIssue(Integer issueId,Integer changementId, String issue);

    List<Changement> getAllChangementByUser(Integer userId);

    Changement notifyChangement(Integer changementId) throws MessagingException;


    }
