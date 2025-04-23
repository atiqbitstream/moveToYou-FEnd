// src/app/shared/interceptors/http-error.interceptor.ts
import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpRequest,
    HttpContextToken,
    HttpContext,
    HttpEvent
  } from '@angular/common/http';
  import { inject } from '@angular/core';
  import { Observable, throwError } from 'rxjs';
  import { catchError, retry } from 'rxjs/operators';
  import { LoggerService } from '../services/logger.service';
  import { NotificationService } from '../services/notification.service';
  import { Router } from '@angular/router';
  import { TokenService } from '../services/token.service';
  
  // Context token allowing specific HTTP requests to bypass this interceptor
  export const SKIP_ERROR_HANDLING = new HttpContextToken<boolean>(() => false);
  
  // Interface for structured error logging
  interface HttpErrorLog {
    url: string;
    method: string;
    status: number;
    message?: string;
    error: any; // Full error object (useful during debugging)
  }
  
  /**
   * Centralized error handling interceptor for HTTP requests
   * - Applies retry logic for network errors
   * - Provides structured error logging
   * - Delivers user-friendly notifications
   * - Handles authentication failures
   */
  export const httpErrorInterceptor = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> => {
    // Inject services directly into the interceptor function
    const logger = inject(LoggerService);
    const notificationService = inject(NotificationService);
    const router = inject(Router);
    const tokenService = inject(TokenService);
  
    // Allow bypassing error handling for requests marked with SKIP_ERROR_HANDLING
    if (request.context.get(SKIP_ERROR_HANDLING)) {
      return next(request);
    }
  
    return next(request).pipe(
      // Retry failed requests up to 2 times in case of network errors
      retry(2),
      
      // Catch HTTP errors and handle them
      catchError((error: HttpErrorResponse) => {
        const errMsg = getErrorMessage(error);
        const logData: HttpErrorLog = {
          url: request.url,
          method: request.method,
          status: error.status,
          message: error.message,
          error: error.error // Include full error object
        };
  
        handleLogging(error, logData, logger);
        handleUserFeedback(error, request, errMsg, notificationService, router, tokenService);
        
        return throwError(() => error);
      })
    );
  };
  
  /**
   * Logs errors with appropriate severity based on status code
   * - 5xx: Server errors
   * - 4xx: Client errors
   * - Others: Informational
   */
  const handleLogging = (
    error: HttpErrorResponse,
    logData: HttpErrorLog,
    logger: LoggerService
  ): void => {
    if (error.status >= 500) {
      logger.error('Server Error', logData);
    } else if (error.status >= 400) {
      logger.warn('Client Error', logData);
    } else {
      logger.info('HTTP Error', logData);
    }
  };
  
  /**
   * Displays user-friendly messages and handles specific error statuses:
   * - 401: Unauthorized (logout user, redirect to login)
   * - 403: Forbidden
   * - 404: Not Found
   * - 429: Too Many Requests
   * - 500: Internal Server Error
   * Silent requests (background calls) skip user notifications
   */
  const handleUserFeedback = (
    error: HttpErrorResponse,
    request: HttpRequest<unknown>,
    errMsg: string,
    notificationService: NotificationService,
    router: Router,
    tokenService: TokenService
  ): void => {
    // Avoid user notifications for silent/background API calls
    if (request.headers.get('X-Silent-Request') === 'true') return;
  
    switch (error.status) {
      case 0:
        notificationService.showError('Network error. Please check your internet connection.');
        break;
  
      case 401:
        // Log out the user and redirect to login if token/session is invalid
        tokenService.logOut();
        if (!request.url.includes('/auth/login')) {
          notificationService.showError('Session expired. Please login again.');
          router.navigate(['/auth/login']);
        }
        break;
  
      case 403:
        notificationService.showError('You do not have permission to perform this action.');
        break;
  
      case 404:
        notificationService.showError('The requested resource was not found.');
        break;
  
      case 429:
        notificationService.showError('Too many requests. Please try again later.');
        break;
  
      case 500:
        notificationService.showError('Internal server error. Our team has been notified.');
        break;
  
      default:
        // Show generic error for all other 4xx errors
        if (error.status >= 400 && error.status < 500) {
          notificationService.showError(errMsg);
        }
        break;
    }
  };
  
  /**
   * Determines the most appropriate error message to display
   * - Handles browser/network errors
   * - Parses different API error formats
   * - Provides fallback messages when no specific info available
   */
  const getErrorMessage = (error: HttpErrorResponse): string => {
    // Handle network or browser-side errors
    if (error.error instanceof ErrorEvent) {
      return `Client error: ${error.error.message}`;
    }
  
    // Handle plain string errors
    if (typeof error.error === 'string') {
      return error.error;
    }
  
    // Handle structured error objects
    return [
      error.error?.message,
      error.error?.detail,
      error.error?.title,
      error.error?.error,
      error.message,
      `HTTP ${error.status}: ${error.statusText}`
    ].find(msg => typeof msg === 'string') || 'An unexpected error occurred';
  };