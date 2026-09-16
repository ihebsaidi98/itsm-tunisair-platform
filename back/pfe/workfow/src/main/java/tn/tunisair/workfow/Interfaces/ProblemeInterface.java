package tn.tunisair.workfow.Interfaces;

import org.apache.el.parser.BooleanNode;
import org.springframework.web.multipart.MultipartFile;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Entities.StatutProbleme;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface ProblemeInterface {
     Probleme ajouterProbleme(Probleme probleme, MultipartFile fichier,String id) ;
    Probleme findProblemeById(Integer id);
    List<Probleme> findAllProblemes();
    List<Probleme> findAllTypesProblemes();
    void deleteProbleme(Integer id);
    Probleme updateProbleme(Integer id, Probleme problemeDetails, MultipartFile fichier);
    List<Probleme> getProblemesByStatut(StatutProbleme statut);

    List<Probleme> getResolvedProblemesWithinDateRange(Date startDate, Date endDate);

    void processProblemeState(Integer incidentId, StatutProbleme StatutProbleme);
    void closeProbleme(Integer id);
    void startWorkOnProbleme(Integer id) ;

    void downloadfile(String name) ;

    Probleme AffectPeople(Integer problemId, Integer[] idUsers);

    List<Probleme> getAllProblemsWithUser(Long id);

    void notifyPeople(Integer id ,List<String> emails);

    List<Probleme> getProblemesByArchivedTrue();

    Probleme archiveProbleme(Integer id);
    Probleme UnarchiveProbleme(Integer id);


    }
