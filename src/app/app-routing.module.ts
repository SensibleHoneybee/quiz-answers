import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateGameGuard } from './activate-game-guard';
import { GameScreenComponent } from './game-screen/game-screen.component';
import { JoinGameComponent } from './join-game/join-game.component';

const routes: Routes = [
  { path: '', component: GameScreenComponent, canActivate: [ActivateGameGuard] },
  { path: 'join-game', component: JoinGameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
