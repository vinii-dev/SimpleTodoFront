import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { LoginResponse } from './auth.model';
import { AuthFacade } from './auth.facade';

describe('AuthFacade with Jest', () => {
  let facade: AuthFacade;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockToken = 'test-jwt-token';
  const loginResponse: LoginResponse = { token: mockToken };

  beforeEach(() => {
    const mockAuthService: jest.Mocked<AuthService> = {
      login: jest.fn(),
      register: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    facade = TestBed.inject(AuthFacade);
    authServiceMock = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    localStorage.clear();
  });

  it('should login and store token in localStorage', (done) => {
    authServiceMock.login.mockReturnValue(of(loginResponse));

    facade.login('user', 'pass').subscribe((res) => {
      expect(res.token).toBe(mockToken);
      expect(localStorage.getItem('token')).toBe(mockToken);

      facade.isAuthenticated$.subscribe(auth => {
        expect(auth).toBe(true);
        done();
      });
    });
  });

  it('should register then login successfully', (done) => {
    authServiceMock.register.mockReturnValue(of());
    authServiceMock.login.mockReturnValue(of(loginResponse));

    facade.register('user', 'pass').subscribe((res) => {
      expect(authServiceMock.register).toHaveBeenCalledWith('user', 'pass');
      expect(authServiceMock.login).toHaveBeenCalledWith('user', 'pass');
      expect(res.token).toBe(mockToken);
      done();
    });
  });

  it('should logout and clear token', (done) => {
    localStorage.setItem('token', mockToken);

    facade.logout();
    expect(localStorage.getItem('token')).toBeNull();

    facade.isAuthenticated$.subscribe(auth => {
      expect(auth).toBe(false);
      done();
    });
  });

  it('should return true when token exists in checkAuthStatus()', () => {
    localStorage.setItem('token', mockToken);
    const result = facade.checkAuthStatus();
    expect(result).toBe(true);
  });

  it('should return false when token does not exist in checkAuthStatus()', () => {
    const result = facade.checkAuthStatus();
    expect(result).toBe(false);
  });
});
