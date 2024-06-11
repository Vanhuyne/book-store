import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule) },
  // Wildcard route for a 404 page can be added here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
