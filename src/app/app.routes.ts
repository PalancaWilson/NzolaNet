import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Feed } from './pages/feed/feed';
import { Profile } from './pages/profile/profile';
import { Notifications } from './pages/notifications/notifications';
import { Settings }  from './pages/settings/settings';


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
    },
    {
        path: 'notifications',
        component: Notifications
    },
    {
        path: ' settings',
        component: Settings
    }
    

];
