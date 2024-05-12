import { DashboardContainerComponent } from './../modules/dashboard/dashboard-container/dashboard-container.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadChildren: () => import('../modules/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'map',
        loadChildren: () => import('../modules/map/map.module').then(m => m.MapModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
