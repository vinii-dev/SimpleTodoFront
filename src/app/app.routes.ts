import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { TodoListComponent } from './features/todo/todo-list/todo-list.component';
import { authGuard } from './core/auth/auth.guard';
import { HomeComponent } from './features/todo/home/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
