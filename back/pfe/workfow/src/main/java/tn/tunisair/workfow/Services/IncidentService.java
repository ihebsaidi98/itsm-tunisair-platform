package tn.tunisair.workfow.Services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.tunisair.workfow.Email.EmailService;
import tn.tunisair.workfow.Email.EmailTemplateName;
import tn.tunisair.workfow.Entities.*;
import tn.tunisair.workfow.Interfaces.IncidentInterface;
import tn.tunisair.workfow.Repositories.IncidentRepository;

import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import reactor.core.publisher.Mono;
import tn.tunisair.workfow.Repositories.UserRepository;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class IncidentService implements IncidentInterface {
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final StateMachineFactory<StatutIncident, EvenementIncident> stateMachineFactory;
    private final EmailService emailService;


    @Override
    public Incident ajouterIncident(Incident incident, MultipartFile fichier, Long id) {
        incident.setStatutIncident(StatutIncident.SIGNALE);

        User user = userRepository.findById(id).orElse(null);
        incident.setUser(user);

        if (fichier == null) {
            return incidentRepository.save(incident);
        }

        String newFileName = UUID.randomUUID() + "_" + fichier.getOriginalFilename();
        String filePath = System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + newFileName;
        try {
            FileOutputStream fout = new FileOutputStream(filePath);
            fout.write(fichier.getBytes());
            fout.close();
            System.out.println("File Uploaded Successfully");
            incident.setFilename(fichier.getOriginalFilename());
            incident.setEncodedfilename(newFileName);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error in uploading file: ");
        }

        return incidentRepository.save(incident);
    }


    @Override
    public Incident findIncidentById(Integer id) {
        return incidentRepository.findById(id).orElse(null);
    }

    @Override
    public List<Incident> findAllIncidents() {
        return incidentRepository.findByArchivedFalse();
    }

    @Override
    public List<Incident> findAllTypesIncidents() {
        return incidentRepository.findAll();
    }


    @Override
    public void deleteIncident(Integer id) {
        Incident incident = findIncidentById(id);
        if (incident.getEncodedfilename() != null) {
            try {
                Files.deleteIfExists(Paths.get(System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + incident.getEncodedfilename()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        incidentRepository.deleteById(id);
    }

    @Override
    public Incident updateIncident(Integer id, Incident incidentDetails, MultipartFile fichier) {
        Incident oldIncident = incidentRepository.findById(id).orElse(null);

        if (oldIncident == null) {
            return null;
        }

        if (fichier != null) {
            if (oldIncident.getEncodedfilename() != null) {
                try {
                    Files.deleteIfExists(Paths.get(System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + oldIncident.getEncodedfilename()));
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
                oldIncident.setFilename(fichier.getOriginalFilename());
                oldIncident.setEncodedfilename(newFileName);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Error in uploading file: ");
            }

        }

        oldIncident.setDescription(incidentDetails.getDescription());
        oldIncident.setImpact(incidentDetails.getImpact());
        oldIncident.setCategorie(incidentDetails.getCategorie());
        oldIncident.setNatureIncident(incidentDetails.getNatureIncident());
        oldIncident.setDateCreation(incidentDetails.getDateCreation());
        oldIncident.setDateResolution(incidentDetails.getDateResolution());
        oldIncident.setEcheance(incidentDetails.getEcheance());
        oldIncident.setHistoriqueActions(incidentDetails.getHistoriqueActions());
        oldIncident.setStatutIncident(incidentDetails.getStatutIncident());
        oldIncident.setPriorite(incidentDetails.getPriorite());
        oldIncident.setEvenementIncident(incidentDetails.getEvenementIncident());
        oldIncident.setArchived(incidentDetails.isArchived());
        return incidentRepository.save(oldIncident);
    }


    @Override
    public void archiveResolvedIncidents() {
        List<Incident> resolvedIncidents = incidentRepository.findByStatutIncident(StatutIncident.RESOLU);
        for (Incident incident : resolvedIncidents) {
            incident.setArchived(true);
            incidentRepository.save(incident);
        }
    }

    @Override
    public List<Incident> getIncidentsByStatut(StatutIncident statut) {
        return incidentRepository.findByStatutIncident(statut);
    }

    @Override
    public List<Incident> getIncidentsByCategory(String categorie) {
        return incidentRepository.findByCategorie(categorie);
    }

    @Override
    public List<Incident> getAllArchivedIncidents() {
        return incidentRepository.findByArchivedTrue();
    }

    @Override
    public List<Incident> getResolvedIncidentsWithinDateRange(Date startDate, Date endDate) {
        return incidentRepository.findByStatutIncidentAndDateResolutionBetween(StatutIncident.RESOLU, startDate, endDate);
    }

    @Override
    public Map<String, Long> countIncidentsByCategory() {
        List<Object[]> results = incidentRepository.countByCategory();
        Map<String, Long> countMap = new HashMap<>();
        for (Object[] result : results) {
            countMap.put((String) result[0], (Long) result[1]);
        }
        return countMap;
    }

    @Override
    public void processIncidentState(Integer incidentId, EvenementIncident event) {
        Incident incident = incidentRepository.findById(incidentId).orElse(null);
        if (incident != null) {
            StateMachine<StatutIncident, EvenementIncident> stateMachine = stateMachineFactory.getStateMachine();
            stateMachine.getExtendedState().getVariables().put("incident", incident);

            stateMachine.startReactively()
                    .thenMany(stateMachine.sendEvent(Mono.just(MessageBuilder.withPayload(event).build())))
                    .doOnComplete(() -> {
                        incident.setStatutIncident(stateMachine.getState().getId());
                        incidentRepository.save(incident);
                    })
                    .subscribe();
        }
    }

    @Override
    public void closeIncident(Integer id) {
        processIncidentState(id, EvenementIncident.RESOUDRE);
    }

    public void startWorkOnIncident(Integer id) {
        processIncidentState(id, EvenementIncident.COMMENCER_TRAVAIL);
    }
    @Override
    public Incident AffectPeople(Integer problemId, Integer[] idUsers) {
        System.out.println(Arrays.toString(idUsers));
        Incident incident = incidentRepository.findById(problemId).orElse(null);
        if (incident == null) {
            return null;
        }
        incident.getAffectedUsers().clear();
        if(idUsers.length == 0){
            incidentRepository.save(incident);
            return incident;
        }

        for(Integer id : idUsers){
            User user = userRepository.findById(Long.parseLong(id.toString())).orElse(null);
            if(user != null){
                incident.getAffectedUsers().add(user);
            }
        }
        incidentRepository.save(incident);

        return incident;

    }

    @Override
    public void notifyPeople(Integer id, List<String> emails) {
        Incident incident = incidentRepository.findById(id).orElse(null);
        if (incident == null) {
            return;
        }
        for (String email : emails) {
            try {
                emailService.sendNotficationEmail(
                        email,
                        EmailTemplateName.NOTIFY_INCIDENT,
                        "http://localhost:4200/incident/"+id
                );
            } catch (Exception ex) {
                System.out.println(ex);
            }

        }

    }

    @Override
    public List<Incident> getIncidentsByArchivedTrue() {
        return incidentRepository.findByArchivedTrue();
    }

    @Override
    public Incident archiveIncident(Integer id) {
        Incident incident = incidentRepository.findById(id).orElse(null);
        if (incident == null) {
            return null;
        }
        incident.setArchived(true);
        return incidentRepository.save(incident);
    }

    @Override
    public Incident UnarchiveIncident(Integer id) {
        Incident incident = incidentRepository.findById(id).orElse(null);
        if (incident == null) {
            return null;
        }
        incident.setArchived(false);
        return incidentRepository.save(incident);
    }


    public List<Incident> getAllIncidentsWithUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        return incidentRepository.findByUser(user);
    }

}
