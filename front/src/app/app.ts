import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent } from './login/login.component'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers : []
})
export class App {
  protected title = 'front';
}
