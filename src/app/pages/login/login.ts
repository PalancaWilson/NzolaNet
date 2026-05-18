import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthLayout } from "../../components/auth-layout/auth-layout";

@Component({
  selector: 'app-login',
  imports: [RouterLink, AuthLayout],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
