import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentService } from 'app/services/incident.service';
import { Incident } from 'models/incident.model';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { HttpClient } from '@angular/common/http';
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../../models/user.model";
import {ToastrService} from "ngx-toastr";
import {RagService} from "../../../services/rag.service";

@Component({
  selector: 'app-incident',
  templateUrl: './archivedIncidents.component.html',
  styleUrls: ['./archivedIncidents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArchivedIncidentsComponent implements OnInit {
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
  public isClient;
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
    private ragService: RagService,
    private authService: AuthService
  ) {}

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  ngOnInit(): void {
    this.isClient = this.authService.isClient;
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
    this.incidents = []
    if(this.authService.isClient){
      this.incidentService.getAllArchivedIncidents().subscribe((data: Incident[]) => {

        data.forEach((incident)=>{
          if(incident.user.id === this.userId){
            this.incidents.push(incident)
          }
        })

        this.tempData = [...this.incidents];

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

      return;
    }

    this.incidentService.getAllArchivedIncidents().subscribe((data: Incident[]) => {
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

  archiveIncident(id:number){
    this.incidentService.UnarchiveIncident(id).subscribe(()=>{
      this.loadIncidents();
    })
  }

  ToggleAiModal(): void {
    this.showAiModal = !this.showAiModal;
  }
  ToggleaskAi(id: number) {
    this.ToggleAiModal()
    this.selectedItem =  this.incidents.find(changement => changement.id === id);
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
