import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';

import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public avatarImage: string;

  // private
  private _unsubscribeAll: Subject<any>;


  constructor(private authService: AuthService,private userService: UserService,private fb: FormBuilder) {
    this._unsubscribeAll = new Subject();
      this.passwordForm = this.fb.group(
          {
              newPassword: [
                  '',
                  [
                      Validators.required,
                      Validators.minLength(8),
                  ],
              ],
              confirmPassword: ['', Validators.required],
          },
          { validators: this.passwordMatchValidator }
      );
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
    passwordForm: FormGroup;


  /**
   * Upload Image
   *
   * @param event
   */


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {

    this.data = this.authService.currentUserValue
    // content header
    this.contentHeader = {
      headerTitle: 'Account Settings',
      actionButton: true,
      breadcrumb: {

      }
    };
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

 updateGeneralInfo() {
  if (!this.data.firstname || !this.data.lastname) {
    console.error('First Name and Last Name cannot be empty');
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(this.data.email)) {
    console.error('Invalid email format');
    return;
  }
   const formData = new FormData();
   formData.append('firstname', this.data.firstname);
   formData.append('lastname', this.data.lastname);
   formData.append('password', this.data.password);
   formData.append('email', this.data.email);
   formData.append('role', this.data.role);

   this.userService.updateUser(this.data.id,formData).subscribe(
       response => {
         console.log('User updated successfully');
         this.authService.refreshSession(this.data);
       },
       error => {
         console.error('Error occurred while adding user', error);
       }
   );
}

    togglePasswordTextTypeOld() {
        this.passwordTextTypeOld = !this.passwordTextTypeOld;
    }

    togglePasswordTextTypeNew() {
        this.passwordTextTypeNew = !this.passwordTextTypeNew;
    }

    togglePasswordTextTypeRetype() {
        this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
    }

    passwordMatchValidator(group: FormGroup) {
        const newPassword = group.get('newPassword').value;
        const confirmPassword = group.get('confirmPassword').value;
        return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }

    updatePassword() {
        if (!this.passwordForm.valid) {
            return null;
        }
        const { newPassword } = this.passwordForm.value;
        this.data.password = newPassword
        this.userService.updatePassword(this.data).subscribe()


    }
}
