import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { ButtonModule } from 'primeng/button';
import { AuthFacade } from '../../../core/auth/auth.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-home',
  imports: [
    DividerModule,
    TodoListComponent,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  authFacade = inject(AuthFacade);
  router = inject(Router);

  public logout() {
    this.authFacade.logout();
  }
}
