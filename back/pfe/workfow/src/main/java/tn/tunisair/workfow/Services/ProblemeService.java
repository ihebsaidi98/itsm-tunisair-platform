package tn.tunisair.workfow.Services;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;
import tn.tunisair.workfow.Email.EmailService;
import tn.tunisair.workfow.Email.EmailTemplateName;
import tn.tunisair.workfow.Entities.StatutProbleme;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Entities.StatutProbleme;
import tn.tunisair.workfow.Entities.User;
import tn.tunisair.workfow.Interfaces.ProblemeInterface;
import tn.tunisair.workfow.Repositories.ProblemeRepository;
import tn.tunisair.workfow.Repositories.UserRepository;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class ProblemeService implements ProblemeInterface {
    private final ProblemeRepository ProblemeRepository;
    private final UserRepository UserRepository;
    private final EmailService emailService;


    @Override
    public Probleme ajouterProbleme(Probleme Probleme, MultipartFile fichier,String id) {
        Probleme.setStatutProbleme(StatutProbleme.NOUVEAU);

        User user = UserRepository.findById(Long.parseLong(id)).orElse(null);
        Probleme.setUser(user);

        if (fichier == null) {
            return ProblemeRepository.save(Probleme);
        }
        String newFileName = UUID.randomUUID() + "_" + fichier.getOriginalFilename();
        String filePath = System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + newFileName;
        try {
            FileOutputStream fout = new FileOutputStream(filePath);
            fout.write(fichier.getBytes());
            fout.close();
            System.out.println("File Uploaded Successfully");
            Probleme.setFilename(fichier.getOriginalFilename());
            Probleme.setEncodedfilename(newFileName);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error in uploading file: ");
        }

        return ProblemeRepository.save(Probleme);
    }


    @Override
    public Probleme findProblemeById(Integer id) {
        return ProblemeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Probleme> findAllProblemes() {
        return ProblemeRepository.findByArchivedFalse();
    }

    @Override
    public List<Probleme> findAllTypesProblemes() {
        return ProblemeRepository.findAll();
    }

    @Override
    public void deleteProbleme(Integer id) {
        Probleme probleme = findProblemeById(id);
        if (probleme.getEncodedfilename() != null) {
            try {
                Files.deleteIfExists(Paths.get(System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + probleme.getEncodedfilename()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        ProblemeRepository.deleteById(id);
    }

    @Override
    public Probleme updateProbleme(Integer id, Probleme ProblemeDetails, MultipartFile fichier) {

        Probleme oldProbleme = ProblemeRepository.findById(id).orElse(null);
        if (oldProbleme == null) {
            return null;
        }

        if (fichier != null) {
            if (oldProbleme.getEncodedfilename() != null) {
                try {
                    Files.deleteIfExists(Paths.get(System.getProperty("user.dir") + "/workfow/src/main/resources/uploads" + File.separator + oldProbleme.getEncodedfilename()));
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
                oldProbleme.setFilename(fichier.getOriginalFilename());
                oldProbleme.setEncodedfilename(newFileName);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Error in uploading file: ");
            }

        }

        oldProbleme.setDescription(ProblemeDetails.getDescription());
        oldProbleme.setImpact(ProblemeDetails.getImpact());
        oldProbleme.setDateCreation(ProblemeDetails.getDateCreation());
        oldProbleme.setDateResolution(ProblemeDetails.getDateResolution());
        oldProbleme.setStatutProbleme(ProblemeDetails.getStatutProbleme());
        oldProbleme.setPriorite(ProblemeDetails.getPriorite());

        return ProblemeRepository.save(oldProbleme);

    }


    @Override
    public List<Probleme> getProblemesByStatut(StatutProbleme statut) {
        return ProblemeRepository.findByStatutProbleme(statut);
    }

    @Override
    public List<Probleme> getResolvedProblemesWithinDateRange(Date startDate, Date endDate) {
        return ProblemeRepository.findByStatutProblemeAndDateResolutionBetween(StatutProbleme.RESOLU, startDate, endDate);
    }


    @Override
    public void processProblemeState(Integer ProblemeId, StatutProbleme event) {
//        Probleme Probleme = ProblemeRepository.findById(ProblemeId).orElse(null);
//        if (Probleme != null) {
//            StateMachine<StatutProbleme, StatutProbleme> stateMachine = stateMachineFactory.getStateMachine();
//            stateMachine.getExtendedState().getVariables().put("Probleme", Probleme);
//
//            stateMachine.startReactively()
//                    .thenMany(stateMachine.sendEvent(Mono.just(MessageBuilder.withPayload(event).build())))
//                    .doOnComplete(() -> {
//                        Probleme.setStatutProbleme(stateMachine.getState().getId());
//                        ProblemeRepository.save(Probleme);
//                    })
//                    .subscribe();
//        }
    }

    @Override
    public void closeProbleme(Integer id) {
        processProblemeState(id, StatutProbleme.RESOLU);
    }

    @Override
    public void startWorkOnProbleme(Integer id) {
        processProblemeState(id, StatutProbleme.EN_COURS_RESOLUTION);
    }

    @Override
    public void downloadfile(String name) {
    }

    @Override
    public Probleme AffectPeople(Integer problemId, Integer[] idUsers) {
        System.out.println(Arrays.toString(idUsers));
        Probleme probleme = ProblemeRepository.findById(problemId).orElse(null);
        if (probleme == null) {
            return null;
        }
        probleme.getAffectedUsers().clear();
        if(idUsers.length == 0){
            ProblemeRepository.save(probleme);
            return probleme;
        }

        for(Integer id : idUsers){
            User user = UserRepository.findById(Long.parseLong(id.toString())).orElse(null);
            if(user != null){
                probleme.getAffectedUsers().add(user);
            }
        }
        ProblemeRepository.save(probleme);

        return probleme;

    }

    public List<Probleme> getAllProblemsWithUser(Long id) {
        User user = UserRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        return ProblemeRepository.findByUser(user);
    }

    @Override
    public void notifyPeople(Integer id, List<String> emails) {
        Probleme probleme = ProblemeRepository.findById(id).orElse(null);
        if (probleme == null) {
            return;
        }
        for (String email : emails) {
            try {
                emailService.sendNotficationEmail(
                        email,
                        EmailTemplateName.NOTIFY_ISSUE,
                        "http://localhost:4200/probleme/"+id
                );
            } catch (Exception ex) {
                System.out.println(ex);
            }

        }


    }

    @Override
    public List<Probleme> getProblemesByArchivedTrue() {
        return ProblemeRepository.findByArchivedTrue();
    }

    @Override
    public Probleme archiveProbleme(Integer id) {
        Probleme probleme = ProblemeRepository.findById(id).orElse(null);
        if (probleme == null) {
            return null;
        }
        probleme.setArchived(true);
        return ProblemeRepository.save(probleme);
    }

    @Override
    public Probleme UnarchiveProbleme(Integer id) {
        Probleme probleme = ProblemeRepository.findById(id).orElse(null);
        if (probleme == null) {
            return null;
        }
        probleme.setArchived(false);
        return ProblemeRepository.save(probleme);
    }


}
