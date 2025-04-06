import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { TodoItem, TodoItemCreate, TodoItemPatch, TodoItemUpdate } from './todo.model';
import { PagedList } from '../../core/models/paged-list.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  http = inject(HttpClient);

  getPagedTodos(page: number, limit: number): Observable<PagedList<TodoItem>> {
    return this.http.get<PagedList<TodoItem>>(environment.baseUrl + '/todoItem', { params: { page, pageSize: limit } });
  }

  getTodo(id: string): Observable<TodoItem> {
    return this.http.get<TodoItem>(environment.baseUrl + '/todoItem/' + id);
  }

  addTodo(todo: TodoItemCreate): Observable<string> {
    return this.http.post<string>(environment.baseUrl + '/todoItem', todo);
  }

  updateTodo(id: string, todo: TodoItemUpdate): Observable<void> {
    return this.http.put<void>(environment.baseUrl + '/todoItem/' + id, todo);
  }

  patchTodo(id: string, todo: TodoItemPatch): Observable<void> {
    return this.http.patch<void>(environment.baseUrl + '/todoItem/' + id, todo);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(environment.baseUrl + '/todoItem/' + id);
  }
}
