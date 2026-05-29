import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthLayout } from "../../layouts/auth-layout/auth-layout";

import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';


@Component({
    selector: 'app-login',

    imports: [
        ReactiveFormsModule,
        RouterLink,
        AuthLayout
    ],

    templateUrl: './login.html',

    styleUrl: './login.css'
})
export class Login {

    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder
    ) {

        this.loginForm = this.fb.group({

            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                      '^[a-z][a-z0-9._%+-]*@(gmail|hotmail|outlook|yahoo)\\.com$'
                    )
                ]
            ],

            password: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                      '^[a-zA-Z][a-zA-Z0-9]{3,15}$'
                    )
                ]
            ]

        });

    }

    entrar(): void {

        if(this.loginForm.invalid){

            this.loginForm.markAllAsTouched();

            return;

        }

        console.log(this.loginForm.value);

        /*
            Aqui depois:
            this.authService.login(...)
        */

    }

}

