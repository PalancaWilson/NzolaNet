import { Component } from '@angular/core';
import {AuthLayout} from "../../components/auth-layout/auth-layout";

@Component({
  selector: 'app-register',
  imports: [AuthLayout],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {}
