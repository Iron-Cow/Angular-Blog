import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {MainLayoutComponent} from "./shared/components/main-layout/main-layout.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {PostPageComponent} from "./post-page/post-page.component";
import {CommonModule} from "@angular/common";


const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {path: '', component: HomePageComponent, },
      {path: 'post/:id', component: PostPageComponent},
    ]
  },
  {
    // path: 'admin', loadChildren: './admin/admin.module#AdminModule', // NOT WORK ANYMORE
    path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules // loading all after required page load
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
