import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { JsonPipe } from '@angular/common';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatLabel,
    MatButton,
    MatInput,
    JsonPipe,
    MatError,
    TextInputComponent
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private formbuilder = inject(FormBuilder);
  private accountService= inject(AccountService);
  private router = inject(Router);
  private snack = inject(SnackbarService);
  validationError?: string[];

  registerForm = this.formbuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['',[Validators.required,Validators.email]],
    password:['', Validators.required],
  });

  onSubmit(){
    this.accountService.register(this.registerForm.value).subscribe({
      next:()=> {
        this.snack.sucess('Registeration successful - you can now login');
        this.router.navigateByUrl('/account/login');
      },
      error: errors => this.validationError=errors
    })
  }

}
