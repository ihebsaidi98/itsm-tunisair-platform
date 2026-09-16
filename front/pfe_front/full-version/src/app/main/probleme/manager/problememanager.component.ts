import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {Subject} from 'rxjs';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';

import {CoreTranslationService} from '@core/services/translation.service';

import {locale as german} from 'app/main/tables/datatables/i18n/de';
import {locale as english} from 'app/main/tables/datatables/i18n/en';
import {locale as french} from 'app/main/tables/datatables/i18n/fr';
import {locale as portuguese} from 'app/main/tables/datatables/i18n/pt';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ProblemeService} from "../../../services/problem.service";
import {Probleme} from "../../../../models/probleme.model";
import {AuthService} from "../../../services/auth.service";
import {ToastrService} from "ngx-toastr";
import {User} from "../../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {RagService} from "../../../services/rag.service";

@Component({
  selector: 'app-problememanager',
  templateUrl: './problememanager.component.html',
  styleUrls: ['./problememanager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProblemeManagerComponent implements OnInit {
  // Private
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public contentHeader: object;
  public rows: any;
  public selected = [];
  public ProblemRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  public exportCSVData;
  public ProblemeForm: FormGroup;
  public showModal = false;
  private selectedProblemeId: number | null = null;
  public isEditMode = false;
  public formSubmitted = false;
  private selectedFile: File | null = null;
  private userId: number;
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
    this.ProblemRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  rowDetailsToggleExpand(row) {
    console.log(row)
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }
  resetForm(): void {
    this.ProblemeForm.reset();
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.resetForm();
      this.isEditMode = false;
    }
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
      private problemeService: ProblemeService,
      private fb: FormBuilder,
      private userService: UserService,
      private _toastrService: ToastrService,
      private authService: AuthService,
      private ragService: RagService,
      private http: HttpClient
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, french, german, portuguese);
  }

  formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }


  loadProblems(): void {
    this.problemeService.getAllProblemes().subscribe((data: Probleme[]) => {
      this.rows = data;
      this.tempData = [...data];

      this.ProblemRows = this.rows;
      this.exportCSVData = this.rows;

      data.forEach(probleme => {
        let tab = []
        probleme.affectedUsers.forEach((user:User)=>{
          tab.push(user.id)
        })
        this.AffectedUsers.push(tab)
      })

    });
  }
  loadUsers(): void {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  ngOnInit() {
    this.userId = this.authService.getId
    this.ProblemeForm = this.fb.group({
      description: ['', Validators.required],
      impact: ['', Validators.required],
      priorite: ['', Validators.required],
      statutProbleme: ['', Validators.required],
      dateResolution: [null,Validators.required],
    });
    this.loadUsers();
    this.loadProblems();
    this.contentHeader = {
      headerTitle: 'Problems',
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
            name: 'Problem',
            isLink: true,
            link: '/probleme'
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

  addProbleme() {
    if (this.ProblemeForm.invalid) {
      this.formSubmitted = true;
      return;
    }

    const formValues = this.ProblemeForm.value;


    const formData = new FormData();
    formData.append('description', formValues.description);
    formData.append('impact', formValues.impact);
    formData.append('priorite', formValues.priorite);
    formData.append('statutProbleme', formValues.statutProbleme);
    const dateCreation = new Date().toISOString().split('.')[0];
    formData.append('dateCreation', dateCreation);
    const dateResolution = new Date(formValues.dateResolution).toISOString().split('.')[0];
    formData.append('dateResolution', dateResolution);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    formData.append("user_id", this.userId.toString());

    this.problemeService.addProbleme(formData).subscribe(
        response => {
          console.log('Probleme added successfully', response);
          this.toggleModal();
          this.loadProblems();
          this.formSubmitted = false;
        },
        error => {
          console.error('Error occurred while adding probleme', error);
        }
    );
  }


  deleteProbleme(id:number) {
    this.problemeService.deleteProbleme(id).subscribe(
        response => {
          console.log('Probleme deleted successfully', response);
          this.loadProblems();
        },
        error => {
          console.error('Error occurred while adding probleme', error);
        }
    );
  }



  openEditModal(id: number): void {
    this.isEditMode = true;
    this.showModal = true;
    this.selectedProblemeId = id;
    let probleme = this.ProblemRows.find(probleme => probleme.id === id);
    this.ProblemeForm.patchValue(probleme);
  }

  editProbleme() {
    if (this.ProblemeForm.invalid || !this.selectedProblemeId) {
      this.formSubmitted = true;
      return;
    }
    let formValues = this.ProblemeForm.value;
    let probleme = this.ProblemRows.find(probleme => probleme.id === this.selectedProblemeId);

    const formData = new FormData();
    formData.append('description', formValues.description);
    formData.append('impact', formValues.impact);
    formData.append('priorite', formValues.priorite);
    formData.append('statutProbleme', formValues.statutProbleme);
    const dateCreation = probleme.dateCreation;
    formData.append('dateCreation', dateCreation);
    const dateResolution = new Date(formValues.dateResolution).toISOString().split('.')[0];
    formData.append('dateResolution', dateResolution);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.problemeService.updateProbleme(this.selectedProblemeId,formData).subscribe(
        response => {
          console.log('Probleme added successfully', response);
          this.toggleModal();
          this.loadProblems();
          this.formSubmitted = false;
        },
        error => {
          console.error('Error occurred while adding probleme', error);
        }
    );

  }


  downloadFile(filename): void {


    let probleme = this.ProblemRows.find(probleme => probleme.filename === filename);


    this.problemeService.downloadFile(probleme.encodedfilename).subscribe(
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

  NotifyPeople(value: any) {
    this.NotifiedUsers = []
    value.forEach(id => {
      let user = this.users.find(probleme => probleme.id === id);
      this.NotifiedUsers.push(user)
    })
    console.log(this.NotifiedUsers)

  }

  affectpeople(index:number,value: any) {
    const problemId = this.rows[index].id;
    const data = {
      problemId : problemId,
      users: value
    }
    this.problemeService.affectPeople(data).subscribe(
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
    this.selectedItem =  this.rows.find(changement => changement.id === id);
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

  archiveProblem(id: any) {
    this.problemeService.archiveProbleme(id).subscribe(()=>{
      this.loadProblems()
    })
  }


}
