import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [MatButton],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent {

  //baseUrl = "https://localhost:5001/api/";
  baseUrl = environment.apiUrl;

  private htttp = inject(HttpClient);
  validationErrors?: string[];


  get404Error() {
    this.htttp.get(this.baseUrl + 'buggy/notfound').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get400Error() {
    this.htttp.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get401Error() {
    this.htttp.get(this.baseUrl + 'buggy/unauthorized').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get500Error() {
    this.htttp.get(this.baseUrl + 'buggy/internalerror').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get400ValidationError() {
    this.htttp.post(this.baseUrl + 'buggy/validationerror',{}).subscribe({
      next: response => console.log(response),
      error: error => this.validationErrors = error
    })
  }
}