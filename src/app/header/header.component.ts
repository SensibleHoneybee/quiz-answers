import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from '../game.service';
import { Game } from '../game';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentPlayerName: string;
  currentPlayerNameSubscription: Subscription;
  currentGame: Game;
  currentGameSubscription: Subscription;

  constructor(private gameService: GameService, private router: Router) { 
    this.currentPlayerNameSubscription = this.gameService.currentPlayerName.subscribe(playerName => {
      this.currentPlayerName = playerName;
    });
    this.currentGameSubscription = this.gameService.currentGame.subscribe(game => {
      this.currentGame = game;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentPlayerNameSubscription.unsubscribe();
    this.currentGameSubscription.unsubscribe();
  }

  doLogout() {
    this.gameService.setPlayerName(null);

    this.router.navigate(['/join-game']);
  }

  get title(): string {
    if (this.currentGame == null || this.currentGame.isAwaitingParticipantsGame) {
      return 'Quiz';
    }

    return this.currentGame.gameName;
  }

}
