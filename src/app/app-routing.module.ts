import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { UserListComponent } from './user-list/user-list.component';


export const routes: Routes = [ // Export the routes constant
  { path: '', redirectTo: 'user-list', pathMatch: 'full' },
  { path: 'add-user', component: AddUserComponent },
  { path: 'user-list', component: UserListComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
