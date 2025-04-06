import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoItem } from '../../todo.model';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-todo-item',
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule,
    InputTextModule,
    DatePipe,
    ButtonModule,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  @Input()
  todoItem: TodoItem = {} as TodoItem;

  @Output()
  onEdit = new EventEmitter<void>();

  @Output()
  onToggle = new EventEmitter<void>();

  @Output()
  onRemove = new EventEmitter<void>();
}
