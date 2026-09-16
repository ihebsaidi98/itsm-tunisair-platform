package tn.tunisair.workfow.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tunisair.workfow.Entities.Changement;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Services.ChangementService;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/changement")
@Tag(name = "Changement Management")
public class ChangementController {

    private final ChangementService changementService;

    @Operation(description = "Add changement")
    @PostMapping("/add/{id}")
    public Changement addChangement(  @ModelAttribute Changement changement,
                                      @PathVariable Integer id,
                                      @RequestPart(value = "file", required = false) MultipartFile fichier) {
        return changementService.addChangement(changement,id,fichier);
    }

    @Operation(description = "Find one changement")
    @GetMapping("/{id}")
    public Changement findChangementById(@PathVariable Integer id) {
        return changementService.findChangementById(id);
    }

    @Operation(description = "Find all changements")
    @GetMapping("/list")
    public List<Changement> getAllChangements() {
        return changementService.findAllChangements();
    }

    @Operation(description = "Delete changement")
    @DeleteMapping("/delete/{id}")
    public void deleteChangement(@PathVariable Integer id) {
        changementService.deleteChangement(id);
    }

    @Operation(description = "Update changement")
    @PutMapping("/update/{id}")
    public Changement updateChangement( @PathVariable Integer id,
                                        @ModelAttribute Changement changementDetails,
                                        @RequestPart(value = "file", required = false) MultipartFile fichier) {
        return changementService.updateChangement(id, changementDetails, fichier);
    }

    @Operation(description = "Add changement to incident")
    @PostMapping("/addIncident/{incidentId}")
    public Changement addChangementToIncident(@PathVariable Integer incidentId, @RequestBody Changement changement) {
        return changementService.addChangementToIncident(incidentId, changement);
    }

    @Operation(description = "Get all changements by incidentId")
    @GetMapping("/incident/{incidentId}")
    public List<Changement> getAllChangementsByIncidentId(@PathVariable Integer incidentId) {
        return changementService.getAllChangementsByIncidentId(incidentId);
    }

    @Operation(description = "Delete changement from incident")
    @DeleteMapping("/incident/{incidentId}/delete/{changementId}")
    public void deleteChangementFromIncident(@PathVariable Integer incidentId, @PathVariable Integer changementId) {
        changementService.deleteChangementFromIncident(incidentId, changementId);
    }

    @Operation(description = "Update changement in incident")
    @PutMapping("/incident/{incidentId}/update/{changementId}")
    public Changement updateChangementInIncident(@PathVariable Integer incidentId, @PathVariable Integer changementId, @RequestBody Changement updatedChangement) {
        return changementService.updateChangementInIncident(incidentId, changementId, updatedChangement);
    }

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

    @Operation(description = "Affecter changement to issue")
    @PutMapping(value = "/affecter/{changementid}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Changement> affecterChangementToIssue(
            @PathVariable Integer changementid,
            @RequestBody Map<String, String> issue
    ) {
        Changement changement = changementService.affecterChangementToIssue(
                Integer.valueOf(issue.get("issueid")),
                changementid,
                issue.get("type")
        );
        return ResponseEntity.ok(changement);
    }

    @Operation(description = "Get all changements by user")
    @GetMapping("/getresponsablechangement/{userId}")
    public List<Changement> getAllChangementByUser(@PathVariable Integer userId) {
        return changementService.getAllChangementByUser(userId);
    }

    @Operation(description = "Notify changement")
    @PutMapping("/notify/{changementId}")
    public Changement notifyChangement(@PathVariable Integer changementId) throws MessagingException {
        return changementService.notifyChangement(changementId);
    }



}
