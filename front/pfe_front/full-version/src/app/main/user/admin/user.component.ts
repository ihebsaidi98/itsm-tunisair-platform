import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';

import { locale as german } from 'app/main/tables/datatables/i18n/de';
import { locale as english } from 'app/main/tables/datatables/i18n/en';
import { locale as french } from 'app/main/tables/datatables/i18n/fr';
import { locale as portuguese } from 'app/main/tables/datatables/i18n/pt';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../../services/user.service";
import {User} from "../../../../models/user.model";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  // Private
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public contentHeader: object;
  public rows: any;
  public selected = [];
  public UserRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  public exportCSVData;
  public UserForm: FormGroup;
  public showModal = false;
  private selectedUserId: number | null = null;
  public isEditMode = false;
  public formSubmitted = false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;




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
    this.UserRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  rowDetailsToggleExpand(row) {
    console.log(row)
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }
  resetForm(): void {
    this.UserForm.reset();
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
              private userService: UserService,
              private authService: AuthService,
              private fb: FormBuilder,
              private http: HttpClient
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, french, german, portuguese);
  }

  formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }


  loadUsers(): void {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.rows = data;
      this.tempData = [...data];

      this.UserRows = this.rows;
      this.exportCSVData = this.rows;


    });
  }
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmpassword');

    return password && confirmPassword && password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
  };
  ngOnInit() {
    this.UserForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', Validators.minLength(8)],
      confirmpassword: ['', Validators.minLength(8)],
      email: ['', Validators.email],
      role: ['', Validators.required],
    },{ validators: this.passwordMatchValidator });

    this.loadUsers();
    this.contentHeader = {
      headerTitle: 'Users',
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
            name: 'User',
            isLink: true,
            link: '/user'
          },
        ]
      }
    };
  }


  addUser() {
    if (this.UserForm.invalid) {
      this.formSubmitted = true;
      return;
    }


    console.log("from")
    const formValues = this.UserForm.value;


    this.authService.addUser(formValues).subscribe(
        response => {
          console.log('User added successfully', response);
          this.toggleModal();
          this.loadUsers();
          this.formSubmitted = false;
        },
        error => {
          console.error('Error occurred while adding user', error);
        }
    );
  }


  deleteUser(id:number) {
    this.userService.deleteUser(id).subscribe(
        response => {
          console.log('User deleted successfully', response);
          this.loadUsers();
        },
        error => {
          console.error('Error occurred while adding user', error);
        }
    );
  }



  openEditModal(id: number): void {
    this.isEditMode = true;
    this.showModal = true;
    this.selectedUserId = id;
    let user = this.UserRows.find(user => user.id === id);
    this.UserForm.patchValue(user);
  }

  editUser() {
    if (this.UserForm.invalid || !this.selectedUserId) {
      this.formSubmitted = true;
      return;
    }
    let formValues = this.UserForm.value;
    let user = this.UserRows.find(user => user.id === this.selectedUserId);

    const formData = new FormData();
    formData.append('firstname', formValues.firstname);
    formData.append('lastname', formValues.lastname);
    formData.append('password', formValues.password);
    formData.append('email', formValues.email);
    formData.append('role', formValues.role);


    this.userService.updateUser(this.selectedUserId,formData).subscribe(
        response => {
          console.log('User added successfully', response);
          this.toggleModal();
          this.loadUsers();
          this.formSubmitted = false;
        },
        error => {
          console.error('Error occurred while adding user', error);
        }
    );

  }




}
