import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private gameService: GameService) {
    }

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
          yourName: ['', Validators.required]
      });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

  onSubmit() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    
    this.gameService.setPlayerName(this.f.yourName.value);

    this.router.navigate(['/']);
  }
}