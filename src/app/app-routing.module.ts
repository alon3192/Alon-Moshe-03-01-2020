import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FavoritesComponent } from './favorites/favorites.component';


const appRoutes:Routes = [
    { path: '', component:HomeComponent},
    { path: 'favorites', component: FavoritesComponent }
]
    @NgModule({
        imports: [RouterModule.forRoot(appRoutes)],
        exports: [RouterModule]
    })
    export class AppRoutingModule {}

