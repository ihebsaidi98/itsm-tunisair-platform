import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import { Subject } from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';

import { locale as german } from 'app/main/tables/datatables/i18n/de';
import { locale as english } from 'app/main/tables/datatables/i18n/en';
import { locale as french } from 'app/main/tables/datatables/i18n/fr';
import { locale as portuguese } from 'app/main/tables/datatables/i18n/pt';

import * as snippet from 'app/main/tables/datatables/datatables.snippetcode';

import { DatatablesService } from 'app/main/tables/datatables/datatables.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ChangementService} from "../../../services/changement.service";
import {Changement} from "../../../../models/changement.model";
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {mapHash} from "@fullcalendar/angular";
import {ProblemeService} from "../../../services/problem.service";
import {IncidentService} from "../../../services/incident.service";
import {RagService} from "../../../services/rag.service";

@Component({
  selector: 'app-changement',
  templateUrl: './changement.component.html',
  styleUrls: ['./changement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangementComponent implements OnInit {
  // Private
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public contentHeader: object;
  public rows: any;
  public selected = [];
  public ChangementRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  public exportCSVData;
  public ChangementForm: FormGroup;
  public showModal = false;
  public showAiModal = false;
  private selectedChangementId: number | null = null;
  public isEditMode = false;
  public formSubmitted = false;
  private selectedFile: File | null = null;
  private userId: number;
  public AffectedIssues = [];
  public selectedItem : any;
  public hasPDFfile: boolean = false;
  public chatMessage = '';
  scrolltop: number = null;
  public newChat;
  public chats : {
    chat:[{
      message:string,
      userId :number,
    }]
  }={
    chat:[{
      message:'Ask you question !',
      userId :0,
    }]
  };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  @ViewChild('scrollMe') scrollMe: ElementRef;




  /**
   * Search (filter)
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.full_name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.ChangementRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  rowDetailsToggleExpand(row) {
    console.log(row)
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }
  resetForm(): void {
    this.ChangementForm.reset();
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.resetForm();
      this.isEditMode = false;
    }
  }

  ToggleAiModal(): void {
    this.showAiModal = !this.showAiModal;
  }


  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }


  onActivate(event) {

  }

  customChkboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }


  constructor(
              private _coreTranslationService: CoreTranslationService,
              private changementService: ChangementService,
              private fb: FormBuilder,
              private userService: UserService,
              private problemService: ProblemeService,
              private incidentService: IncidentService,
              private authService: AuthService,
              private ragService: RagService
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, french, german, portuguese);
  }

  formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }


  loadChangements(): void {
    this.changementService.getAllChangements().subscribe((data: Changement[]) => {
      this.rows = data;
      this.tempData = [...data];
      console.log(data)
      this.ChangementRows = this.rows;
      this.exportCSVData = this.rows;


    });
  }
  loadAffectedIssues() : void {
    this.problemService.getAllProblemes().subscribe((data:any)=>{
      data.forEach(problem=>{
          problem.type="problem";
        this.AffectedIssues.push(problem)
      })
    })
    this.incidentService.getAllIncidents().subscribe((data:any)=>{
      data.forEach(incident=>{
        incident.type="incident";
        this.AffectedIssues.push(incident)
      })
    })

  }

  ngOnInit() {
    this.ChangementForm = this.fb.group({
      description: ['', Validators.required],
      categorie: ['', Validators.required],
      priorite: ['', Validators.required],
      statutChangement: ['', Validators.required],
      dateDebutPrevu: [null,Validators.required],
      dateFinPrevu: [null,Validators.required],
      commentaire: ['',Validators.required],
      motif: ['',Validators.required],
      etapesMiseEnOeuvre: ['',Validators.required],
      actionsCorrectives: ['',Validators.required],
      evaluationRisques: ['',Validators.required],
      impactUtilisateurs: ['',Validators.required],
      affectedIssues: [null,Validators.required],
    });
    this.userId = this.authService.getId

    this.loadAffectedIssues()
    this.loadChangements();
    this.contentHeader = {
      headerTitle: 'Updates',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Changement',
            isLink: true,
            link: '/changement'
          },
        ]
      }
    };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  addChangement() {
    if (this.ChangementForm.invalid) {
      this.formSubmitted = true;
      return;
    }

    const formValues = this.ChangementForm.value;

    let changement = this.ChangementRows.find(changement => changement.id === this.selectedChangementId);
    let issueIndex = formValues.affectedIssues;
    let issue = this.AffectedIssues[issueIndex];

    const formData = new FormData();
    formData.append('description', formValues.description);
    formData.append('evenementChangement', 'DEMANDER');
    formData.append('priorite', formValues.priorite);
    formData.append('statutChangement', formValues.statutChangement);
    const dateCreation = new Date().toISOString().split('.')[0];
    formData.append('dateCreation', dateCreation);
    const dateDebutPrevu = new Date(formValues.dateDebutPrevu).toISOString().split('.')[0];
    formData.append('dateDebutPrevu', dateDebutPrevu);
    const dateFinPrevu = new Date(formValues.dateFinPrevu).toISOString().split('.')[0];
    formData.append('dateFinPrevu', dateFinPrevu);
    formData.append('commentaire', formValues.commentaire);
    formData.append('motif', formValues.motif);
    formData.append('etapesMiseEnOeuvre', formValues.etapesMiseEnOeuvre);
    formData.append('actionsCorrectives', formValues.actionsCorrectives);
    formData.append('evaluationRisques', formValues.evaluationRisques);
    formData.append('impactUtilisateurs', formValues.impactUtilisateurs);
    formData.append('categorie', formValues.categorie);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }



    this.changementService.addChangement(this.userId,formData).subscribe(
        response => {
          console.log('Changement added successfully');
          this.toggleModal();
          this.loadChangements();
          this.selectedFile = null;
          this.formSubmitted = false;
          let data = {
            id:response.id,
            issueid:issue.id,
            type:issue.type
           }
          this.changementService.affectChangementToIssue(data).subscribe(
              response => console.log('affected issue')
          )
        },
        error => {
          console.error('Error occurred while adding changement', error);
        }
    );
  }


  deleteChangement(id:number) {
    this.changementService.deleteChangement(id).subscribe(
        response => {
          console.log('Changement deleted successfully', response);
          this.loadChangements();
        },
        error => {
          console.error('Error occurred while adding changement', error);
        }
    );
  }



  openEditModal(id: number): void {
    this.isEditMode = true;
    this.showModal = true;
    this.selectedChangementId = id;
    let changement = this.ChangementRows.find(changement => changement.id === id);
    let issue
    if(changement.probleme){
      issue = this.AffectedIssues.find(issue => issue.id === changement.probleme.id)
    }else if(changement.incident) {
      issue = this.AffectedIssues.find(issue => issue.id === changement.incident.id)
    }
    let issueIndex = this.AffectedIssues.indexOf(issue)
    this.ChangementForm.patchValue(changement);
    this.ChangementForm.patchValue({
      affectedIssues: issueIndex
    });
  }

  editChangement() {
    if (this.ChangementForm.invalid || !this.selectedChangementId) {
      this.formSubmitted = true;
      return;
    }
    let formValues = this.ChangementForm.value;
    let changement = this.ChangementRows.find(changement => changement.id === this.selectedChangementId);
    let issueIndex = formValues.affectedIssues;
    let issue = this.AffectedIssues[issueIndex];

    const formData = new FormData();
    formData.append('description', formValues.description);
    formData.append('evenementChangement', 'DEMANDER');
    formData.append('priorite', formValues.priorite);
    formData.append('statutChangement', formValues.statutChangement);
    const dateCreation = changement.dateCreation
    formData.append('dateCreation', dateCreation);
    const dateDebutPrevu = new Date(formValues.dateDebutPrevu).toISOString().split('.')[0];
    formData.append('dateDebutPrevu', dateDebutPrevu);
    const dateFinPrevu = new Date(formValues.dateFinPrevu).toISOString().split('.')[0];
    formData.append('dateFinPrevu', dateFinPrevu);
    formData.append('commentaire', formValues.commentaire);
    formData.append('motif', formValues.motif);
    formData.append('etapesMiseEnOeuvre', formValues.etapesMiseEnOeuvre);
    formData.append('actionsCorrectives', formValues.actionsCorrectives);
    formData.append('evaluationRisques', formValues.evaluationRisques);
    formData.append('impactUtilisateurs', formValues.impactUtilisateurs);
    formData.append('categorie', formValues.categorie);


    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.changementService.updateChangement(this.selectedChangementId,formData).subscribe(
        response => {
          console.log('Changement added successfully', response);
          this.selectedFile = null;
          this.formSubmitted = false;
          let data = {
            id:response.id,
            issueid:issue.id,
            type:issue.type
          }
          this.changementService.affectChangementToIssue(data).subscribe(
              response => {
                console.log('affected issue')
                this.toggleModal();
                this.loadChangements();
              }
          )
        },
        error => {
          console.error('Error occurred while adding changement', error);
        }
    );
  }


  downloadFile(filename): void {

    let changement = this.ChangementRows.find(changement => changement.filename === filename);


    this.changementService.downloadFile(changement.encodedfilename).subscribe(
        (response: Blob) => {
          const blobUrl = window.URL.createObjectURL(response);

          const anchor = document.createElement('a');
          anchor.href = blobUrl;
          anchor.download = filename;
          anchor.click();

          window.URL.revokeObjectURL(blobUrl);
        },
        (error) => {
          console.error('Error occurred while downloading file', error);
        }
    );
  }
  ToggleaskAi(id: number) {
    this.ToggleAiModal()
    this.selectedItem =  this.ChangementRows.find(changement => changement.id === id);
    this.hasPDFfile = this.selectedItem && this.selectedItem.filename && this.selectedItem.filename.toLowerCase().endsWith('.pdf');
  }

  updateChat() {
    this.newChat = {
      message: this.chatMessage,
      time: this.formatDate(new Date()),
      userId: 2
    };

      if (this.newChat.message !== '') {
        this.chats.chat.push(this.newChat);

        let data = {
          prompt:this.newChat.message
        }
        let filename = this.selectedItem.encodedfilename

        this.ragService.getAiAnwser(data,filename).subscribe(
            (response) => {
              this.newChat = {
                message: response.data,
                time: this.formatDate(new Date()),
                userId: 0
              };
              this.chats.chat.push(this.newChat);
            }
        )

        this.chatMessage = '';
        setTimeout(() => {
          this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
        }, 0);
      }

  }
}
