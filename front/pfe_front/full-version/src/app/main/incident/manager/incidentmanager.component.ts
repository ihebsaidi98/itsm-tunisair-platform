import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentService } from 'app/services/incident.service';
import { Incident } from 'models/incident.model';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../../models/user.model";
import {ToastrService} from "ngx-toastr";
import {RagService} from "../../../services/rag.service";

@Component({
  selector: 'app-incidentmanager',
  templateUrl: './incidentmanager.component.html',
  styleUrls: ['./incidentmanager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IncidentmanagerComponent implements OnInit {
  public contentHeader!: ContentHeader;
  public incidents: Incident[] = [];
  public tempData: Incident[] = [];
  public basicSelectedOption = 10;
  public ColumnMode = ColumnMode;
  public selected = []
  public incidentForm: FormGroup;
  public showModal = false;
  public isEditMode = false;
  private selectedIncidentId: number | null = null;
  private selectedFile: File | null = null;
  public exportCSVData;
  public IncidentRows: any;
  private userId: number;
  public formSubmitted = false;
  public users: User[];
  public AffectedUsers = [];
  public NotifiedUsers = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  public showAiModal = false;
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
  @ViewChild('scrollMe') scrollMe: ElementRef;


  constructor(
    private incidentService: IncidentService,
    private fb: FormBuilder,
    private _toastrService: ToastrService,
    private userService: UserService,
    private authService: AuthService,
    private ragService: RagService,
  ) {}

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  ngOnInit(): void {
    this.incidentForm = this.fb.group({
      description: ['', Validators.required],
      impact: ['', Validators.required],
      priorite: ['', Validators.required],
      statutIncident: ['', Validators.required],
      categorie: ['', Validators.required],
      natureIncident: ['', Validators.required],
      dateResolution: [null],
      echeance: [null],
      historiqueActions: [''],
      evenementIncident: ['', Validators.required],
    });

    this.loadIncidents();
    this.loadUsers();



    this.contentHeader = {
      headerTitle: 'Incident Table',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Home', isLink: true, link: '/' },
          { name: 'Incident List', isLink: false }
        ]
      }
    };
    this.userId = this.authService.getId
  }

  loadIncidents(): void {
    this.incidentService.getAllIncidents().subscribe((data: Incident[]) => {
      this.incidents = data;
      this.tempData = [...data];

      this.IncidentRows = this.incidents;
      this.exportCSVData = this.incidents;

      data.forEach(incident => {
        let tab = []
        incident.affectedUsers.forEach((user:User)=>{
          tab.push(user.id)
        })
        this.AffectedUsers.push(tab)
      })

    });
  }

  filterUpdate(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    const filteredData = this.tempData.filter((incident) => {
      return (
        incident.description.toLowerCase().includes(searchValue) ||
        incident.categorie.toLowerCase().includes(searchValue) ||
        incident.natureIncident.toLowerCase().includes(searchValue)
      );
    });
    this.incidents = filteredData;
    this.table.offset = 0;
  }

  onActivate(event: any): void {
  }
  rowDetailsToggleExpand(row) {
    console.log(row)
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }
  onSelect(event: any): void {
    console.log('Rows selected', event);
  }
  formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  addIncident() {

    if (this.incidentForm.invalid) {
      this.formSubmitted = true;
      return;
    }

    const formValues = this.incidentForm.value;
    const formData = new FormData();
    formData.append('description', formValues.description);
    formData.append('impact', formValues.impact);
    formData.append('categorie', formValues.categorie);
    formData.append('natureIncident', formValues.natureIncident);
    const dateCreation = new Date().toISOString().split('.')[0];
    formData.append('dateCreation', dateCreation);
    const dateResolution = new Date(formValues.dateResolution).toISOString().split('.')[0];
    formData.append('dateResolution', dateResolution);
    const dateecheance = new Date(formValues.echeance).toISOString().split('.')[0];
    formData.append('echeance', dateecheance);
    formData.append('historiqueActions', formValues.historiqueActions);
    formData.append('priorite', formValues.priorite);
    formData.append('statutIncident', formValues.statutIncident);
    formData.append('evenementIncident', formValues.evenementIncident);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    formData.append("user_id", this.userId.toString());

    this.incidentService.addIncident(formData).subscribe(
      response => {
        let emails = this.NotifiedUsers.map(user => user.email);
        this.incidentService.notifypeople(response.id, emails).subscribe(
            response => {
              console.log('Incident added successfully', response);
              this.toggleModal();
              this.loadIncidents();
              this.formSubmitted = false;
              this.NotifiedUsers = [];
            },
            error => {
              console.error('Error occurred while notifying people', error);
            }
        );
      },
      error => {
        console.error('Error occurred while adding incident', error);
      }
    );
  }

  openEditModal(id: number): void {
    this.isEditMode = true;
    this.showModal = true;
    this.selectedIncidentId = id;
    let incident = this.IncidentRows.find(incident => incident.id === id);
    this.incidentForm.patchValue(incident);
  }

  editIncident() {
    if (this.incidentForm.invalid || !this.selectedIncidentId) {
      this.formSubmitted = true;
      return;
    }

    const formValues = this.incidentForm.value;
    const formData = new FormData();
    formData.append('description', formValues.description);
    formData.append('impact', formValues.impact);
    formData.append('categorie', formValues.categorie);
    formData.append('natureIncident', formValues.natureIncident);
    const dateCreation = new Date().toISOString().split('.')[0];
    formData.append('dateCreation', dateCreation);
    const dateResolution = new Date(formValues.dateResolution).toISOString().split('.')[0];
    formData.append('dateResolution', dateResolution);
    const dateecheance = new Date(formValues.echeance).toISOString().split('.')[0];
    formData.append('echeance', dateecheance);
    formData.append('historiqueActions', formValues.historiqueActions);
    formData.append('priorite', formValues.priorite);
    formData.append('statutIncident', formValues.statutIncident);
    formData.append('evenementIncident', formValues.evenementIncident);


    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.incidentService.updateIncident(this.selectedIncidentId,formData).subscribe(
        response => {
          console.log('Incident added successfully', response);
          this.toggleModal();
          this.loadIncidents();
          this.formSubmitted = false;
        },
        error => {
          console.error('Error occurred while adding incident', error);
        }
    );
  }

  deleteIncident(id:number) {
    this.incidentService.deleteIncident(id).subscribe(
        response => {
          console.log('Incident deleted successfully', response);
          this.loadIncidents();
        },
        error => {
          console.error('Error occurred while adding incident', error);
        }
    );
  }


  toggleModal(): void {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.incidentForm.reset();
    this.isEditMode = false;
    this.selectedIncidentId = null;
    this.selectedFile = null; // Reset selected file
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Assign the selected file
    }
  }

  downloadFile(filename): void {

    let incident = this.IncidentRows.find(probleme => probleme.filename === filename);


    this.incidentService.downloadFile(incident.encodedfilename).subscribe(
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

  affectpeople(index:number,value: any) {
    const problemId = this.incidents[index].id;
    const data = {
      problemId : problemId,
      users: value
    }
    this.incidentService.affectPeople(data).subscribe(
        response => {
          setTimeout(() => {
            this._toastrService.success('Affected People with success ! ',
                'Success !',
                {toastClass: 'toast ngx-toastr', closeButton: true}
            );
          }, 2500);
        },
        error => {
          console.error('Error occurred while adding probleme', error);
        }
    );

  }


  ToggleAiModal(): void {
    this.showAiModal = !this.showAiModal;
  }
  ToggleaskAi(id: number) {
    this.ToggleAiModal()
    this.selectedItem =  this.incidents.find(changement => changement.id === id);
    this.hasPDFfile = this.selectedItem && this.selectedItem.filename && this.selectedItem.filename.toLowerCase().endsWith('.pdf');
  }

  archiveIncident(id:number){
    this.incidentService.archiveIncident(id).subscribe(()=>{
      this.loadIncidents();
    })
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
  NotifyPeople(value: any) {
    this.NotifiedUsers = []
    value.forEach(id => {
      let user = this.users.find(user => user.id === id);
      this.NotifiedUsers.push(user)
    })
    console.log(this.NotifiedUsers)

  }

}
