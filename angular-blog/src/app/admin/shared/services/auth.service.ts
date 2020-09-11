import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {tap} from "rxjs/operators";

@Injectable()
export class AuthService {
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
        tap(this.setToken)
      );
  }

  logout(): void{
    this.setToken(null);
  }

  is_authenticated(): boolean{
    return !!this.token;
  }

  // @ts-ignore
  private setToken(response: FbAuthResponse | null): void {
    console.log(response);
    if (response){
    const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);  // convert to ms
    localStorage.setItem('fb-token', response.idToken);
    localStorage.setItem('fb-token-exp', expDate.toString());}
    else{
      localStorage.clear();
    }

  }
}
