import { TestBed } from '@angular/core/testing';
import { TodoFacade } from './todo.facade';
import { TodoService } from './todo.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { PagedList } from '../../core/models/paged-list.model';
import { TodoItem, TodoItemCreate, TodoItemPatch, TodoItemUpdate } from './todo.model';

describe('TodoFacade', () => {
  let facade: TodoFacade;
  let todoServiceMock: jest.Mocked<TodoService>;
  let messageServiceMock: jest.Mocked<MessageService>;

  const mockedTodo = { id: '1', title: 'Test', description: 'Test Description', isCompleted: false, createdAt: new Date() } as TodoItem;
  const mockPagedList: PagedList<TodoItem> = {
    items: [mockedTodo],
    currentPage: 1,
    pageSize: 5,
    totalPages: 1,
    totalCount: 1,
    hasNextPage: false,
    hasPreviousPage: false
  };

  beforeEach(() => {
    todoServiceMock = {
      getPagedTodos: jest.fn(),
      addTodo: jest.fn(),
      updateTodo: jest.fn(),
      patchTodo: jest.fn(),
      deleteTodo: jest.fn(),
      getTodo: jest.fn()
    } as any;

    messageServiceMock = {
      add: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        TodoFacade,
        { provide: TodoService, useValue: todoServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ]
    });

    facade = TestBed.inject(TodoFacade);
  });

  it('should load todos and update state', (done) => {
    todoServiceMock.getPagedTodos.mockReturnValue(of(mockPagedList));

    facade.loadTodos();

    let todosChecked = false;
    let paginationChecked = false;

    facade.todos$.subscribe((todos) => {
      expect(todos).toEqual(mockPagedList.items);
      todosChecked = true;
      maybeDone();
    });

    facade.pagination$.subscribe((pagination) => {
      expect(pagination.totalPages).toBe(mockPagedList.totalPages);
      expect(pagination.totalCount).toBe(mockPagedList.totalCount);
      paginationChecked = true;
      maybeDone();
    });

    function maybeDone() {
      if (todosChecked && paginationChecked) {
        done();
      }
    }
  });

  it('should emit empty list if getPagedTodos throws error', (done) => {
    todoServiceMock.getPagedTodos.mockReturnValue(
      throwError(() => new Error('API Failure'))
    );

    facade.loadTodos();

    facade.todos$.subscribe((todos) => {
      expect(todos).toEqual([]);
      done();
    });
  });

  it('should reset loading on error', (done) => {
    todoServiceMock.getPagedTodos.mockReturnValue(
      throwError(() => new Error('API Failure'))
    );

    facade.loadTodos();

    facade.loading$.subscribe((loading) => {
      if (loading === false) {
        expect(true).toBe(true);
        done();
      }
    });
  });

  it('should add a new todo and reload todos', (done) => {
    const newTodo: TodoItemCreate = { title: 'New Task', description: 'New Description' };

    todoServiceMock.addTodo.mockReturnValue(of('123'));
    todoServiceMock.getPagedTodos.mockReturnValue(of(mockPagedList));

    facade.addTodo(newTodo).subscribe((id) => {
      expect(id).toBe('123');
      expect(todoServiceMock.addTodo).toHaveBeenCalledWith(newTodo);
      expect(todoServiceMock.getPagedTodos).toHaveBeenCalled();
      expect(messageServiceMock.add).toHaveBeenCalledWith(expect.objectContaining({
        severity: 'success',
        summary: 'Sucesso!',
      }));
      done();
    });
  });

  it('should update a todo and show success message', (done) => {
    const update: TodoItemUpdate = { title: 'Updated Title', description: 'Update Description' };
    todoServiceMock.updateTodo.mockReturnValue(of(void 0));
    todoServiceMock.getPagedTodos.mockReturnValue(of(mockPagedList));

    facade.updateTodo('123', update).subscribe(() => {
      expect(todoServiceMock.updateTodo).toHaveBeenCalledWith('123', update);
      expect(messageServiceMock.add).toHaveBeenCalledWith(expect.objectContaining({
        detail: 'Tarefa atualizada com sucesso. ',
      }));
      done();
    });
  });

  it('should patch a todo and show success message', (done) => {
    const patch: TodoItemPatch = { isCompleted: true };
    todoServiceMock.patchTodo.mockReturnValue(of(void 0));
    todoServiceMock.getPagedTodos.mockReturnValue(of(mockPagedList));

    facade.patchTodo('123', patch).subscribe(() => {
      expect(todoServiceMock.patchTodo).toHaveBeenCalledWith('123', patch);
      expect(messageServiceMock.add).toHaveBeenCalledWith(expect.objectContaining({
        detail: 'Tarefa completada com sucesso. ',
      }));
      done();
    });
  });

  it('should delete a todo and reload list', (done) => {
    todoServiceMock.deleteTodo.mockReturnValue(of(void 0));
    todoServiceMock.getPagedTodos.mockReturnValue(of(mockPagedList));

    facade.deleteTodo('123').subscribe(() => {
      expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith('123');
      expect(todoServiceMock.getPagedTodos).toHaveBeenCalled();
      expect(messageServiceMock.add).toHaveBeenCalledWith(expect.objectContaining({
        detail: 'Tarefa deletada com sucesso. ',
      }));
      done();
    });
  });

  it('should get a single todo', (done) => {
    const todo: TodoItem = mockedTodo;
    todoServiceMock.getTodo.mockReturnValue(of(todo));

    facade.getTodo('1').subscribe((result) => {
      expect(todoServiceMock.getTodo).toHaveBeenCalledWith('1');
      expect(result).toEqual(todo);
      done();
    });
  });

  it('should handle loading page when loadPage is called and it is not out of bounds', () => {
    const warnSpy = jest.spyOn(messageServiceMock, 'add');
    todoServiceMock.getPagedTodos.mockReturnValue(of(mockPagedList));
    facade['updatePagination'](mockPagedList);

    facade.loadPage(mockPagedList.currentPage);

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should warn if loadPage is out of bounds', () => {
    const warnSpy = jest.spyOn(messageServiceMock, 'add');
    facade['paginationSubject'].next({
      ...mockPagedList,
      size: mockPagedList.pageSize,
      currentPage: 1,
      totalPages: 1
    });

    facade.loadPage(5);

    expect(warnSpy).toHaveBeenCalledWith(expect.objectContaining({
      severity: 'warn',
      detail: 'Número da página inválido!',
    }));
  });
});
