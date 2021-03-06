import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {Observable, Subject, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();
  constructor(
    private http: HttpClient
  ){}

  get token(): string{
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate){
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    // firebase
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void{
    this.setToken(null);
  }

  is_authenticated(): boolean{
    return !!this.token;
  }
  private handleError(error: HttpErrorResponse): Observable<any>{
    const {message} = error.error.error;

    switch (message) {
      case "INVALID_PASSWORD":
        this.error$.next('Invalid password message');
        break;
      case "INVALID_EMAIL":
        this.error$.next('Invalid email message');
        break;
      case "EMAIL_NOT_FOUND":
        this.error$.next('Not found email message');
        break;

    }

    return throwError(error);
  }
  // @ts-ignore
  private setToken(response: FbAuthResponse | null): void {
    // console.log(response);
    if (response){
    const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);  // convert to ms
    localStorage.setItem('fb-token', response.idToken);
    localStorage.setItem('fb-token-exp', expDate.toString());}
    else{
      localStorage.clear();
    }

  }
}
