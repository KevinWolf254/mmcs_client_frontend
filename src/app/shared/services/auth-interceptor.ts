import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private router: Router){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(request.headers.get('No-Auth') == "true"){
            return next.handle(request.clone());
        }
        if(localStorage.getItem('userToken') != null){
            const clonedRequest = request.clone({
            headers: request.headers.set("Authorization", "Bearer "+localStorage.getItem('userToken'))
            });
            return next.handle(clonedRequest)
            .pipe(
                tap(
                success =>{                    
                },
                error => {
                    if (error.status === 401){
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('userRole');
                        this.router.navigateByUrl('signin');
                    }                        
                })
            );
        }else{
            this.router.navigateByUrl('signin');
        }
    }
}
