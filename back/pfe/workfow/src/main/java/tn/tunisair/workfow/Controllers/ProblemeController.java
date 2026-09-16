package tn.tunisair.workfow.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tunisair.workfow.Entities.Priorite;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Entities.StatutProbleme;
import tn.tunisair.workfow.Services.ProblemeService;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/probleme")
@Tag(name = "Probleme Management")
public class ProblemeController {

    private final ProblemeService problemeService;

    @PostMapping("/add/{id}")
    public ResponseEntity<Probleme> ajouterProbleme(
            @ModelAttribute Probleme probleme,
            @RequestPart(value = "file", required = false) MultipartFile fichier,
            @PathVariable String id) {
        Probleme savedProbleme = problemeService.ajouterProbleme(probleme, fichier, id);
        return ResponseEntity.ok(savedProbleme);
    }

    @Operation(description = "Find one probleme")
    @GetMapping("/un-probleme/{id}")
    public Probleme findProblemeById(@PathVariable Integer id) {
        return problemeService.findProblemeById(id);
    }

    @Operation(description = "Find all problemes")
    @GetMapping("/list")
    public List<Probleme> getAllProblemes() {
        return problemeService.findAllProblemes();
    }

    @Operation(description = "Find all problemes with id user")
    @GetMapping("/problemwithiduser/{id}")
    public List<Probleme> getAllProblemsWithUser(@PathVariable Long id)
     {
        return problemeService.getAllProblemsWithUser(id);
    }

    @Operation(description = "Delete probleme")
    @DeleteMapping("/delete/{id}")
    public void supprimerProbleme(@PathVariable Integer id) {
        problemeService.deleteProbleme(id);
    }

    @Operation(description = "Update probleme")
    @PutMapping("/update/{id}")
    public Probleme updateProbleme(
            @PathVariable Integer id,
            @ModelAttribute Probleme probleme,
            @RequestPart(value = "file", required = false) MultipartFile fichier) {
        return problemeService.updateProbleme(id, probleme,fichier);
    }



    @GetMapping("/probleme/byStatut")
    public List<Probleme> getProblemesByStatut(@RequestParam StatutProbleme statut) {
        return problemeService.getProblemesByStatut(statut);
    }

    @Operation(description = "Close probleme")
    @PutMapping("/close/{id}")
    public void closeProbleme(@PathVariable Integer id) {
        problemeService.closeProbleme(id);
    }





    @Operation(description = "Get resolved problemes within date range")
    @GetMapping("/resolved")
    public List<Probleme> getResolvedProblemesWithinDateRange(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        return problemeService.getResolvedProblemesWithinDateRange(startDate, endDate);
    }



    @Operation(description = "Start work on probleme")
    @PostMapping("/startWork/{id}")
    public ResponseEntity<Void> startWorkOnProbleme(@PathVariable Integer id) {
        problemeService.startWorkOnProbleme(id);
        return ResponseEntity.ok().build();
    }


    // Download file
    @RequestMapping(value = "/download/{path}", method = RequestMethod.GET)
    public ResponseEntity downloadFile(@PathVariable("path") String filename) throws FileNotFoundException {
        String fileUploadpath = System.getProperty("user.dir") +"//workfow/src/main/resources/uploads";
        String filePath = fileUploadpath+ File.separator+filename;
        File file= new File(filePath);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        HttpHeaders headers = new HttpHeaders();
        String contentType = "application/octet-stream";
        String headerValue = "attachment; filename=\"" + resource.getFilename() + "\"";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                .body(resource);

    }

    @Operation(description = "Affect people to probleme")
    @PostMapping("/affect/{problemId}")
    public ResponseEntity<Probleme> AffectPeople(@RequestBody Integer[] idUsers, @PathVariable Integer problemId) {
       Probleme probleme = problemeService.AffectPeople(problemId, idUsers);
       return ResponseEntity.ok(probleme);
    }

    @Operation(description = "Notify people")
    @PostMapping("/notify/{id}")
    public void notifyPeople(@PathVariable Integer id, @RequestBody List<String> emails) {
        problemeService.notifyPeople(id, emails);
    }

    @Operation(description = "Get all problemes by archived true")
    @GetMapping("/archived")
    public List<Probleme> getProblemesByArchivedTrue() {
        return problemeService.getProblemesByArchivedTrue();
    }

    @Operation(description = "Archive probleme")
    @PutMapping("/archive/{id}")
    public Probleme archiveProbleme(@PathVariable Integer id) {
        return problemeService.archiveProbleme(id);
    }

    @Operation(description = "Unarchive probleme")
    @PutMapping("/unarchive/{id}")
    public Probleme UnarchiveProbleme(@PathVariable Integer id) {
        return problemeService.UnarchiveProbleme(id);
    }

    @Operation(description = "Get all types of problemes")
    @GetMapping("/alltypes")
    public List<Probleme> findAllTypesProblemes() {
        return problemeService.findAllTypesProblemes();
    }


}
