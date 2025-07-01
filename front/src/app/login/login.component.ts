import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service'
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule,CommonModule], 
  providers: [ApiService]
})
export class LoginComponent implements OnInit {

  login : string = "";
  password : string = "";
  client$? : Observable<any>;

  constructor(private apiService : ApiService ) { }

  ngOnInit(): void {
  }

  connexion () {
    console.log (this.login + " " + this.password);
    this.client$ = this.apiService.loginClient (this.login,this.password);

  }
}
