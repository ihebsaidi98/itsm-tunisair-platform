import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth-forgot-password-v1',
  templateUrl: './recoveracccount.component.html',
  styleUrls: ['./recoveracccount.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecoveracccountComponent implements OnInit {
  public coreConfig: any;
  public submitted = false;
  public codeError = {
    state:false,
    message:'',
    valid:false
  };
  private code = 0;

  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public PasswordForm: FormGroup;



  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
      private _coreConfigService: CoreConfigService,
      private fb: FormBuilder,
      private router: Router,
  private authService: AuthService) {
    this._unsubscribeAll = new Subject();

    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }
  codes: string[] = ['', '', '', '', '', '']; // Six inputs

  focusNextInput(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (input.value.length === 0 && index > 0) {
      // Focus the previous input if value is empty
      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    } else if (input.value.length > 0 && index < this.codes.length - 1) {
      // Focus the next input if value is entered
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    // Use event.clipboardData instead of window.clipboardData
    const pasteData = event.clipboardData?.getData('text') || '';
    const digits = pasteData.replace(/\D/g, ''); // Only take numbers

    // Populate the inputs with the pasted data
    for (let i = 0; i < this.codes.length; i++) {
      if (digits[i]) {
        this.codes[i] = digits[i];
        const nextInput = document.getElementById(`code-${i + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  }


  /**
   * On Submit
   */
  onSubmit() {
    let numbers = parseInt(this.codes.join(''), 10)
    if(isNaN(numbers)){
      this.codeError.state = true;
      this.codeError.message = "Wrong number";
      return;
    }

    this.authService.activateAccount(numbers).subscribe(
        response => {
          console.log(response)
          if(response.message === "Invalid token"){
            this.codeError.state = true;
            this.codeError.message = "Invalid token";
          }
          else if(response.message === "Token expired"){
            this.codeError.state = true;
            this.codeError.message = "Token expired";
          }
          else if(response.message === "Success"){
            this.codeError.state = false;
            this.codeError.valid = true;
            this.codeError.message = "";
            this.code = numbers;
          }

        }
    );



  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Toggle confirm password
   */
  toggleConfPasswordTextType() {
    this.confPasswordTextType = !this.confPasswordTextType;
  }
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmpassword');

    return password && confirmPassword && password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
  };
  ngOnInit(): void {
    this.PasswordForm = this.fb.group({
      password: ['', Validators.minLength(8)],
      confirmpassword: ['', Validators.minLength(8)],
    },{ validators: this.passwordMatchValidator });

    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  ChangePassword() {
    if (this.PasswordForm.invalid) {
      this.submitted = true;
      return;
    }

    let formValues = this.PasswordForm.value
    let values = {
      code:this.code,
      password:formValues.password
    }

    this.authService.changePasswordAfterActivation(values).subscribe(
        response => {
          if(response.message){
            this.router.navigate(['/login']);
          }else{
            console.log('error')
          }
        }
    );


  }
}
