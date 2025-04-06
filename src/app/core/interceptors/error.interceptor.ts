import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ERROR_MESSAGES } from '../../shared/constants/error-codes';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  messageService = inject(MessageService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const translatedMessage = this.getErrorMessage(error);
        let summary = 'Erro';
        let detail = translatedMessage as string;

        if (translatedMessage instanceof Array) {
          summary = translatedMessage[0];
          detail = translatedMessage[1];
        }

        this.messageService.add({
          severity: 'error',
          summary,
          detail
        });

        return throwError(() => error);
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string | string[] {
    const code = error?.error?.errorCode || 'UNKNOWN_ERROR';

    return ERROR_MESSAGES[code] || 'Erro desconhecido';
  }
}
