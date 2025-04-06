import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { TodoFacade } from '../todo.facade';
import { AsyncPipe } from '@angular/common';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TodoItemModalComponent } from './todo-item-modal/todo-item-modal.component';
import { TodoItem } from '../todo.model';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-todo-list',
  imports: [
    DividerModule,
    AsyncPipe,
    TodoItemComponent,
    PaginatorModule,
    ButtonModule,
    TodoItemModalComponent,
    ConfirmDialogModule,
  ],
  providers: [
    ConfirmationService,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
  private todoFacade = inject(TodoFacade);
  private confirmationService = inject(ConfirmationService);

  todos$ = this.todoFacade.todos$;
  loading$ = this.todoFacade.loading$;
  pagination$ = this.todoFacade.pagination$;

  currentTodoItem: TodoItem = {} as TodoItem;
  isModalVisible = false;

  ngOnInit(): void {
    this.todoFacade.loadTodos();
  }

  onPageChange(event: PaginatorState) {
    this.todoFacade.loadPage(event.page! + 1);
  }

  openModal(todoItem: TodoItem | null) {
    this.currentTodoItem = todoItem ?? {} as TodoItem;
    this.isModalVisible = true;
  }

  onModalClosed() {
    this.isModalVisible = false;
  }

  handleEdit(todoItem: TodoItem) {
    this.openModal(todoItem);
  }

  handleRemove(todoItem: TodoItem) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir essa tarefa? ',
      header: 'Excluir tarefa',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelr',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Excluir',
        severity: 'danger',
      },

      accept: () => {
        this.todoFacade.deleteTodo(todoItem.id).subscribe();
      },
    });
  }

  confirmRemove() {
  }

  handleToggle(todoItem: TodoItem) {
    this.todoFacade.patchTodo(todoItem.id, { isCompleted: todoItem.isCompleted }).subscribe();
  }
}
