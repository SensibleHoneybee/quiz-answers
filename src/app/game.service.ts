import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Game } from './game';
import { Submission } from './submission';

const WEBSERVICE_URL = "https://nu0xeg8y2i.execute-api.eu-west-2.amazonaws.com/Prod/";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentGameSubject: BehaviorSubject<Game>;
  public currentGame: Observable<Game>;
  private currentPlayerNameSubject: BehaviorSubject<string>;
  public currentPlayerName: Observable<string>;

  private gamesUrl = WEBSERVICE_URL + 'games';
  private submissionsUrl = WEBSERVICE_URL + 'submissions';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { 
    var theStoredCurrentPlayerName = sessionStorage.getItem('currentPlayerName');

    this.currentPlayerNameSubject = new BehaviorSubject<string>(theStoredCurrentPlayerName);
    this.currentPlayerName = this.currentPlayerNameSubject.asObservable();
    this.currentGameSubject = new BehaviorSubject<Game>(null);
    this.currentGame = this.currentGameSubject.asObservable();
  }

  setPlayerName(playerName: string) {
    this.currentPlayerNameSubject.next(playerName);

    if (playerName == null || playerName == '') {
      sessionStorage.removeItem('currentPlayerName');
      return;
    }

    sessionStorage.setItem('currentPlayerName', playerName);
  }

  loadLatestGame() {
    this.http.get<Game>(this.gamesUrl + '/latest')
      .pipe(
        catchError(this.handleError<Game>('getLatestGame', null))
      )
      .subscribe(game => this.currentGameSubject.next(game));
  }

  submitAnswer(answers: string[]): Observable<any> {
    var submission: Submission = {
      gameDateAndTime: this.currentGameSubject.value.gameDate + this.currentGameSubject.value.gameTime,
      playerName: this.currentPlayerNameSubject.value,
      answers: answers
    };

    return this.http.put(this.submissionsUrl, submission, this.httpOptions).pipe(
      catchError(this.handleError<any>('submitAnswer'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      if (error.status != 200) {
        // TODO: send the error to remote logging infrastructure
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
      }
      // TODO: better job of transforming error for user consumption
      ///this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

