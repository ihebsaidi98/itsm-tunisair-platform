package tn.tunisair.workfow.Services;

import jakarta.mail.MessagingException;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.tunisair.workfow.Email.EmailService;
import tn.tunisair.workfow.Email.EmailTemplateName;
import tn.tunisair.workfow.Entities.Changement;
import tn.tunisair.workfow.Entities.Incident;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Entities.User;
import tn.tunisair.workfow.Interfaces.ChangementInterface;
import tn.tunisair.workfow.Repositories.ChangementRepository;
import tn.tunisair.workfow.Repositories.IncidentRepository;
import tn.tunisair.workfow.Repositories.ProblemeRepository;
import tn.tunisair.workfow.Repositories.UserRepository;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class ChangementService implements ChangementInterface {

    private final ChangementRepository changementRepository;
    private final IncidentRepository incidentRepository;
    private final ProblemeRepository problemeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;


    @Override
    public Changement addChangement(Changement changement, Integer userid, MultipartFile fichier) {
        User user = userRepository.findById(Long.valueOf(userid)).orElse(null);

        if(user == null){
            return null;
        }
        changement.setResponsable(user);

        if (fichier == null) {
            return changementRepository.save(changement);
        }

        String newFileName = UUID.randomUUID() + "_" + fichier.getOriginalFilename();
        String filePath = System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + newFileName;
        try {
            FileOutputStream fout = new FileOutputStream(filePath);
            fout.write(fichier.getBytes());
            fout.close();
            System.out.println("File Uploaded Successfully");
            changement.setFilename(fichier.getOriginalFilename());
            changement.setEncodedfilename(newFileName);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error in uploading file: ");
        }


        return changementRepository.save(changement);
    }

    @Override
    public Changement findChangementById(Integer id) {
        return changementRepository.findById(id).orElse(null);
    }

    @Override
    public List<Changement> findAllChangements() {
        return changementRepository.findAll();
    }

    @Override
    public void deleteChangement(Integer id) {
        Changement changement = findChangementById(id);

        if (changement.getEncodedfilename() != null) {
            try {
                Files.deleteIfExists(Paths.get(System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + changement.getEncodedfilename()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        changementRepository.deleteById(id);
    }

    @Override
    public Changement updateChangement(Integer id, Changement changementDetails, MultipartFile fichier) {
        Changement oldChangement = changementRepository.findById(id).orElse(null);
        if (oldChangement == null) {
            return null;
        }

        if (fichier != null) {
            if (oldChangement.getEncodedfilename() != null) {
                try {
                    Files.deleteIfExists(Paths.get(System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + oldChangement.getEncodedfilename()));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            String newFileName = UUID.randomUUID() + "_" + fichier.getOriginalFilename();
            String filePath = System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + newFileName;
            try {
                FileOutputStream fout = new FileOutputStream(filePath);
                fout.write(fichier.getBytes());
                fout.close();
                System.out.println("File Uploaded Successfully");
                oldChangement.setFilename(fichier.getOriginalFilename());
                oldChangement.setEncodedfilename(newFileName);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Error in uploading file: ");
            }

        }

        oldChangement.setDescription(changementDetails.getDescription());
        oldChangement.setStatutChangement(changementDetails.getStatutChangement());
        oldChangement.setEvenementChangement(changementDetails.getEvenementChangement());
        oldChangement.setDateCreation(changementDetails.getDateCreation());
        oldChangement.setDateDebutPrevu(changementDetails.getDateDebutPrevu());
        oldChangement.setDateFinPrevu(changementDetails.getDateFinPrevu());
        oldChangement.setPriorite(changementDetails.getPriorite());
        oldChangement.setCategorie(changementDetails.getCategorie());
        oldChangement.setCommentaire(changementDetails.getCommentaire());
        oldChangement.setMotif(changementDetails.getMotif());
        oldChangement.setEtapesMiseEnOeuvre(changementDetails.getEtapesMiseEnOeuvre());
        oldChangement.setActionsCorrectives(changementDetails.getActionsCorrectives());
        oldChangement.setEvaluationRisques(changementDetails.getEvaluationRisques());
        oldChangement.setImpactUtilisateurs(changementDetails.getImpactUtilisateurs());
        oldChangement.setHistoriqueModifications(changementDetails.getHistoriqueModifications());

        return changementRepository.save(oldChangement);
    }

    public Changement addChangementToIncident(Integer incidentId, Changement changement) {
        Incident incident = incidentRepository.findById(incidentId).orElse(null);
        if (incident != null) {
            changement.setIncident(incident);
            return changementRepository.save(changement);
        } else {
            return null;
        }
    }

    public List<Changement> getAllChangementsByIncidentId(Integer incidentId) {
        Incident incident = incidentRepository.findById(incidentId).orElse(null);
        if (incident != null) {
            return incident.getChangements();
        } else {
            return Collections.emptyList();
        }
    }

    public void deleteChangementFromIncident(Integer incidentId, Integer changementId) {
        Incident incident = incidentRepository.findById(incidentId).orElse(null);
        if (incident != null) {
            List<Changement> changements = incident.getChangements();
            changements.removeIf(changement -> changement.getId().equals(changementId));
            incidentRepository.save(incident);
        }
    }

    public Changement updateChangementInIncident(Integer incidentId, Integer changementId, Changement updatedChangement) {
        Incident incident = incidentRepository.findById(incidentId).orElse(null);
        if (incident != null) {
            List<Changement> changements = incident.getChangements();
            for (Changement changement : changements) {
                if (changement.getId().equals(changementId)) {
                    // Update changement details
                    changement.setDescription(updatedChangement.getDescription());
                    changement.setStatutChangement(updatedChangement.getStatutChangement());
                    changement.setEvenementChangement(updatedChangement.getEvenementChangement());
                    changement.setDateCreation(updatedChangement.getDateCreation());
                    changement.setDateDebutPrevu(updatedChangement.getDateDebutPrevu());
                    changement.setDateFinPrevu(updatedChangement.getDateFinPrevu());
                    changement.setPriorite(updatedChangement.getPriorite());
                    changement.setCategorie(updatedChangement.getCategorie());
                    changement.setCommentaire(updatedChangement.getCommentaire());
                    changement.setMotif(updatedChangement.getMotif());
                    changement.setEtapesMiseEnOeuvre(updatedChangement.getEtapesMiseEnOeuvre());
                    changement.setActionsCorrectives(updatedChangement.getActionsCorrectives());
                    changement.setEvaluationRisques(updatedChangement.getEvaluationRisques());
                    changement.setImpactUtilisateurs(updatedChangement.getImpactUtilisateurs());
                    changement.setHistoriqueModifications(updatedChangement.getHistoriqueModifications());
                    changement.setResponsable(updatedChangement.getResponsable());


                    return changementRepository.save(changement);
                }
            }
        }
        return null;
    }

    @Override
    public Changement affecterChangementToIssue(Integer issueId,Integer changementId, String issue) {

        Changement changement = changementRepository.findById(changementId).orElse(null);
        if(changement == null) {
            return null;
        }

        changement.setProbleme(null);
        changement.setIncident(null);

        if (Objects.equals(issue, "problem")) {
            Probleme probleme = problemeRepository.findById(issueId).orElse(null);
            if (probleme != null) {

                changement.setProbleme(probleme);
                return changementRepository.save(changement);
            }
            return null;
        }

        Incident incident = incidentRepository.findById(issueId).orElse(null);
            if (incident != null) {

                changement.setIncident(incident);
                return changementRepository.save(changement);
            }

        return null;

    }

    @Override
    public List<Changement> getAllChangementByUser(Integer userId) {
        return changementRepository.findByResponsableId(userId);
    }

    @Override
    public Changement notifyChangement(Integer changementId) throws MessagingException {
        Changement changement = changementRepository.findById(changementId).orElse(null);
        if (changement != null) {
            sendNotificationMail(changement);
            return changement;
        }

        return null;
    }
    void sendNotificationMail(Changement changement) throws MessagingException {
        try {
            User user = changement.getResponsable();
            if(user!= null){
                emailService.sendEmail(
                        user.getEmail(),
                        user.fullName(),
                        EmailTemplateName.NOTIFY_CHANGE,
                        "",
                        "",
                        "Accepted Changement",
                        changement.getId().longValue()
                );
            }

        } catch (Exception ex) {
            // Log or handle the exception appropriately
            ex.printStackTrace();
            throw new MessagingException("Error occurred while sending validation email", ex);
        }
    }


}
