package tn.tunisair.workfow.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tunisair.workfow.Entities.EvenementIncident;
import tn.tunisair.workfow.Entities.Incident;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Entities.StatutIncident;
import tn.tunisair.workfow.Services.IncidentService;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/incident")
@Tag(name = "Incident Management")
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping("/add/{id}")
    public ResponseEntity<Incident> ajouterIncident(
            @ModelAttribute Incident incident,
            @RequestPart(value = "file", required = false) MultipartFile fichier,@PathVariable Long id) {
        Incident savedIncident = incidentService.ajouterIncident(incident, fichier,id);
        return ResponseEntity.ok(savedIncident);
    }


    @Operation(description = "Find one incident")
    @GetMapping("/un-incident/{id}")
    public Incident findIncidentById(@PathVariable Integer id) {
        return incidentService.findIncidentById(id);
    }

    @Operation(description = "Find all incidents")
    @GetMapping("/list")
    public List<Incident> getAllIncidents() {
        return incidentService.findAllIncidents();
    }

    @Operation(description = "Delete incident")
    @DeleteMapping("/delete/{id}")
    public void supprimerIncident(@PathVariable Integer id) {
        incidentService.deleteIncident(id);
    }

    @Operation(description = "Update incident")
    @PutMapping("/update/{id}")
    public Incident updateIncident(@PathVariable Integer id,
                                   @ModelAttribute Incident incident,
                                   @RequestPart(value = "file", required = false) MultipartFile fichier) {
        return incidentService.updateIncident(id, incident, fichier);
    }

    @Operation(description = "Archive resolved incidents")
    @PostMapping("/archiveResolved")
    public void archiveResolvedIncidents() {
        incidentService.archiveResolvedIncidents();
    }

    @GetMapping("/incident/byStatut")
    public List<Incident> getIncidentsByStatut(@RequestParam StatutIncident statut) {
        return incidentService.getIncidentsByStatut(statut);
    }

    @Operation(description = "Close incident")
    @PutMapping("/close/{id}")
    public void closeIncident(@PathVariable Integer id) {
        incidentService.closeIncident(id);
    }

    @Operation(description = "Get incidents by category")
    @GetMapping("/category/{categorie}")
    public List<Incident> getIncidentsByCategory(@PathVariable String categorie) {
        return incidentService.getIncidentsByCategory(categorie);
    }

    @Operation(description = "Get resolved incidents within date range")
    @GetMapping("/resolved")
    public List<Incident> getResolvedIncidentsWithinDateRange(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        return incidentService.getResolvedIncidentsWithinDateRange(startDate, endDate);
    }

    @Operation(description = "Count incidents by category")
    @GetMapping("/countByCategory")
    public Map<String, Long> countIncidentsByCategory() {
        return incidentService.countIncidentsByCategory();
    }

    @Operation(description = "Process incident state")
    @PostMapping("/process/{id}/{event}")
    public ResponseEntity<Void> processIncidentState(@PathVariable Integer id, @PathVariable EvenementIncident event) {
        incidentService.processIncidentState(id, event);
        return ResponseEntity.ok().build();
    }

    @Operation(description = "Start work on incident")
    @PostMapping("/startWork/{id}")
    public ResponseEntity<Void> startWorkOnIncident(@PathVariable Integer id) {
        incidentService.startWorkOnIncident(id);
        return ResponseEntity.ok().build();
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

    @Operation(description = "Affect people to incident")
    @PostMapping("/affect/{problemId}")
    public Incident AffectPeople(@RequestBody Integer[] idUsers, @PathVariable Integer problemId) {
        return incidentService.AffectPeople(problemId, idUsers);
    }

    @Operation(description = "Find all incidents with id user")
    @GetMapping("/incidentithiduser/{id}")
    public List<Incident> getAllProblemsWithUser(@PathVariable Long id)
    {
        return incidentService.getAllIncidentsWithUser(id);
    }

    @Operation(description = "Notify people about an incident")
    @PostMapping("/notify/{id}")
    public void notifyPeople(@PathVariable Integer id, @RequestBody List<String> emails) {
        incidentService.notifyPeople(id, emails);
    }

    @Operation(description = "Get all incidents by archived true")
    @GetMapping("/archived")
    public List<Incident> getIncidentsByArchivedTrue() {
        return incidentService.getIncidentsByArchivedTrue();
    }

    @Operation(description = "Archive incident")
    @PutMapping("/archive/{id}")
    public Incident archiveIncident(@PathVariable Integer id) {
        return incidentService.archiveIncident(id);
    }

    @Operation(description = "Unarchive incident")
    @PutMapping("/unarchive/{id}")
    public Incident UnarchiveIncident(@PathVariable Integer id) {
        return incidentService.UnarchiveIncident(id);
    }


    @Operation(description = "Find all types of incidents")
    @GetMapping("/alltypes")
    public List<Incident> findAllTypesIncidents() {
        return incidentService.findAllTypesIncidents();
    }

}
