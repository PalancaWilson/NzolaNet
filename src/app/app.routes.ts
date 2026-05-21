import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Feed } from './pages/feed/feed';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [

    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component: Login
    },

    {
        path:'register',
        component: Register
    },
    {
        path:'feed',
        component: Feed
    },
    {
        path:'profile',
        component: Profile
    }

];
