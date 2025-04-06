import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { TodoService } from './todo.service';
import { TodoItem, TodoItemCreate, TodoItemPatch, TodoItemUpdate } from './todo.model';
import { PagedList } from '../../core/models/paged-list.model';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class TodoFacade {
  private todoService = inject(TodoService);
  private messageService = inject(MessageService);

  private todosSubject = new BehaviorSubject<TodoItem[]>([]);
  todos$ = this.todosSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private paginationSubject = new BehaviorSubject({
    currentPage: 1,
    size: 5,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  pagination$ = this.paginationSubject.asObservable();

  private updatePagination(pagedList: PagedList<TodoItem>) {
    const prev = this.paginationSubject.getValue();

    this.paginationSubject.next({
      ...prev,
      totalPages: pagedList.totalPages,
      totalCount: pagedList.totalCount,
      hasNextPage: pagedList.hasNextPage,
      hasPreviousPage: pagedList.hasPreviousPage
    });
  }

  loadTodos(): void {
    const { currentPage, size } = this.paginationSubject.getValue();
    this.loadingSubject.next(true);

    this.todoService.getPagedTodos(currentPage, size).pipe(
      tap({
        next: (pagedList) => {
          this.todosSubject.next(pagedList.items);
          this.updatePagination(pagedList);
        },
        error: () => {
          this.todosSubject.next([]);
        },
        finalize: () => this.loadingSubject.next(false)
      }),
    ).subscribe();
  }

  loadPage(page: number): void {
    const pagination = this.paginationSubject.getValue();
    if (page < 1 || page > pagination.totalPages) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção!',
        detail: 'Número da página inválido!',
      });
      return;
    }
    this.paginationSubject.next({
      ...pagination,
      currentPage: page
    });
    this.loadTodos();
  }

  // loadNextPage(): void {
  //   const pagination = this.paginationSubject.getValue();
  //   if (!pagination.hasNextPage) {
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Atenção!',
  //       detail: 'Não existe páginas seguintes para carregar!',
  //     });
  //     return;
  //   }

  //   this.paginationSubject.next({
  //     ...pagination,
  //     currentPage: pagination.currentPage + 1
  //   });

  //   this.loadTodos();
  // }

  // loadPreviousPage(): void {
  //   const pagination = this.paginationSubject.getValue();
  //   if (!pagination.hasPreviousPage) {
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Atenção!',
  //       detail: 'Não existe páginas anteriores para carregar!',
  //     });
  //     return;
  //   }

  //   this.paginationSubject.next({
  //     ...pagination,
  //     currentPage: pagination.currentPage - 1
  //   });

  //   this.loadTodos();
  // }

  addTodo(todo: TodoItemCreate): Observable<string> {
    this.loadingSubject.next(true);

    return this.todoService.addTodo(todo).pipe(
      tap({
        next: () => {
          this.loadTodos()
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Nova tarefa criada com sucesso!',
          });
        }
      })
    );
  }

  updateTodo(id: string, todo: TodoItemUpdate): Observable<void> {
    this.loadingSubject.next(true);

    return this.todoService.updateTodo(id, todo).pipe(
      tap({
        next: () => {
          this.loadTodos()
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Tarefa atualizada com sucesso. ',
          });
        }
      })
    );
  }

  patchTodo(id: string, todo: TodoItemPatch): Observable<void> {
    this.loadingSubject.next(true);

    return this.todoService.patchTodo(id, todo).pipe(
      tap({
        next: () => {
          this.loadTodos()
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Tarefa completada com sucesso. ',
          });
        }
      })
    );
  }

  deleteTodo(id: string): Observable<void> {
    this.loadingSubject.next(true);

    return this.todoService.deleteTodo(id).pipe(
      tap({
        next: () => {
          this.loadTodos();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Tarefa deletada com sucesso. ',
          });
        }
      })
    );
  }

  getTodo(id: string): Observable<TodoItem> {
    this.loadingSubject.next(true);

    return this.todoService.getTodo(id);
  }
}
