import { isPlatformBrowser } from "@angular/common";
import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { Observable } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

    const platformId = inject(PLATFORM_ID)
    
    if(isPlatformBrowser(platformId))
    {

    const authData = localStorage.getItem('authData');
    let accessToken:string='';

    if(authData)
    {
        const parsedAuthData = JSON.parse(authData);
        accessToken = parsedAuthData.accessToken;
    }

    if(accessToken)
    {
        req = req.clone({
            setHeaders:{
                Authorization:`Bearer ${accessToken}`
            }
        })
    }
}

    return next(req);
  }