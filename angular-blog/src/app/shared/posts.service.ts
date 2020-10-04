import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Post} from "./interfaces";
import {FbCreateResponse} from "../../environments/interface";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
// @ts-ignore
export class PostsService {
  constructor(
    private http: HttpClient
  ){}
  create(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(map((response: FbCreateResponse) => {
        // @ts-ignore
        return  {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };

      }));
  }
}
