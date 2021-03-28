import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Game } from '../game';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent implements OnInit {

  currentGame: Game;
  currentGameSubscription: Subscription;
  loading = false;
  submitted = false;
  dummyRegistrationMode = false;
  playingAnActualGame = false;
  submitBtnText = 'Submit';
  answerForm: FormGroup;
  // answers: {
  //   answerValue: string;
  // }[];

  constructor(private gameService: GameService, private fb: FormBuilder) { 
      this.currentGameSubscription = this.gameService.currentGame.subscribe(game => {
        this.currentGame = game;

        if (this.currentGame != null && this.currentGame.isAwaitingParticipantsGame) {
          this.dummyRegistrationMode = true;
          this.gameService.submitAnswer([]).subscribe(result => {
            this.loading = false;
          });
        } else if (this.currentGame != null) {
          this.playingAnActualGame = true;
          this.loading = false;

          var count = this.currentGame != null ? this.currentGame.questionCount : 0;
          var answers = [];
          for (var i = 0; i < count; i++) {
            answers.push(this.createBox());
          }

          this.answerForm = this.fb.group({
            answers: this.fb.array(answers),
          });
        }
      });
    }

    ngOnInit() {
      this.loading = true;
      this.gameService.loadLatestGame();
    }
  
    ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.currentGameSubscription.unsubscribe();
    }

    get items(): FormArray {
      return this.answerForm.get('answers') as FormArray;
    }

    submit() {
      this.loading = true;
      var answerStrings = [] as string[];
      for (var i = 0; i < this.items.length; i++) {
        if (this.items.at(i).value.answerValue != null && this.items.at(i).value.answerValue != '') {
          answerStrings.push(this.items.at(i).value.answerValue);
        } else {
          answerStrings.push('\xa0');
        }
        
      }
      this.gameService.submitAnswer(answerStrings).subscribe(result => {
        this.loading = false;
        this.submitBtnText = 'Answer submitted';
        this.submitted = true;
      });
    }

    reload() {
      window.location.reload();
    }

    createBox(): FormGroup {
      return this.fb.group({
        answerValue: ['', [Validators.required, Validators.minLength(3)]]
      });
    }
}
