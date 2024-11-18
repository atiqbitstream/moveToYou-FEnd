import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    

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

    return next(req);
  }