import { Component } from '@angular/core';
import { of, concatMap, timer, throwError, catchError, map } from 'rxjs';
const delays$ = of(1000, 2000, Infinity, 3000);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  title = 'ng-error';
  errorHandler(err: any) {
    return new Error('handleError()')
  }
  errorHandler2(ms:number){
    //Option 1: 
    // return throwError(()=> `errorHandler2(): ${ms} without trail`)

    //Option 2:
    throw new Error('new Error() thrown inside function')
    return of(0) //must return observable of same type


  }
  ngOnInit() {
    delays$.pipe(
      concatMap(ms => { //uses the same observable (concatintate)
        // map(ms => {   //Creates new observable pipe
        if (ms < 10000) {
          return timer(ms);
        } else {
          // Option 1: throwError operator, logs the trail of error
                  // return throwError(() => new Error(`throwError(): Invalid time ${ ms } with trail`));

          //Option 2: function that returns error (Depricated)
          // return throwError((err:any)=>this.errorHandler(err))

          //Option 3: directly throw error
          // throw new Error('direct throw new Error')

          //Option 4: throwError inside function, logs only the message
          return this.errorHandler2(ms)
        }
      }),
      //handles the error and must return new observable  
      catchError((err) => { 
        console.log("Caught Error", err)
        return of('I','II','III')})
    )
      .subscribe({
        next: console.log,
        error: console.error
      });
  }
}
