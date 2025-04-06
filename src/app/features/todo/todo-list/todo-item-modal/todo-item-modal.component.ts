import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { TodoItem } from '../../todo.model';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TodoFacade } from '../../todo.facade';
import { iif } from 'rxjs';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-todo-item-modal',
  imports: [
    CommonModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    MessageModule,
    TextareaModule
  ],
  templateUrl: './todo-item-modal.component.html',
  styleUrl: './todo-item-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemModalComponent {
  todoFacade = inject(TodoFacade);
  loading$ = this.todoFacade.loading$;

  @Input()
  todoItem: TodoItem = {} as TodoItem;

  @Input()
  isEditMode = false;

  @Input()
  isModalVisible = false;

  @Output()
  onClosed = new EventEmitter<void>();

  @ViewChild('todoForm') todoForm!: NgForm;

  confirm() {
    if (this.todoForm.invalid) return;

    const { id, title, description } = this.todoItem;
    iif!(
      () => this.isEditMode,
      this.todoFacade.updateTodo(id, { title, description }),
      this.todoFacade.addTodo({ title, description })
    ).subscribe({
      next: () => {
        this.isModalVisible = false;
        this.onClosed.emit();
      }
    });
  }

  closeModal() {
    this.isModalVisible = false;
    if (this.todoForm) {
      this.todoForm.resetForm(this.todoItem);
    }
    this.onClosed.emit();
  }
}
