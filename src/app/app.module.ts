import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChessViewComponent } from './chess-view/chess-view.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { ChessPlayerInfoComponent } from './chess-player-info/chess-player-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChessGameInfoComponent } from './chess-game-info/chess-game-info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MsgboxComponent } from './msgbox/msgbox.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessViewComponent,
    ChessBoardComponent,
    ChessPlayerInfoComponent,
    ChessGameInfoComponent,
    MsgboxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSliderModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
  ],
  entryComponents: [
    MsgboxComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
