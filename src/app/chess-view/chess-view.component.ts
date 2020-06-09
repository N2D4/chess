import { Component, OnInit } from '@angular/core';
import { Square, Piece, Color } from '../../chess-types';
import { MatDialog } from '@angular/material/dialog';
import { MsgboxComponent } from '../msgbox/msgbox.component';
import { LocalPlayerFactory } from '../../chess-players/local-player';
import { ChessPlayer } from 'src/chess-players/chess-player';

const Chess = (globalThis as any).Chess;

@Component({
  selector: 'app-chess-view',
  templateUrl: './chess-view.component.html',
  styleUrls: ['./chess-view.component.scss']
})
export class ChessViewComponent implements OnInit {
  game = new Chess();
  players: [ChessPlayer, ChessPlayer] = [
    LocalPlayerFactory('White', 120000, 0),
    LocalPlayerFactory('Black', 120000, 0),
  ];
  timeRemaining;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.timeRemaining = this.players.map(p => p.msStartTime);
  }

  isGameOver() {
    return this.getGameOverReason() !== null;
  }

  getGameOverReason(): null | ['w' | 'b', 'time' | 'checkmate'] | ['draw', 'insufficient', ] {
    if (this.game.game_over()) {
      return [this.game.turn() === 'w' ? 'b' : 'w', 'checkmate'];
    }
    return null;
  }

  checkPreventPickUp(source: Square, piece: Piece, pos: any, orientation: Color): boolean {
    return this.isGameOver();
  }
  boundCheckPreventPickUp = this.checkPreventPickUp.bind(this);

  checkPreventMove(source: Square, target: Square, piece: Piece, newPos: any, oldPos: any, orientation: Color): boolean {
    console.log(source, target, piece, newPos, oldPos, orientation);
    const gameClone = new Chess(this.game.fen());
    if (!gameClone.move({from: source, to: target})) {
      return true;
    }
    return false;
  }
  boundCheckPreventMove = this.checkPreventMove.bind(this);

  onMove(source: Square, target: Square, piece: Piece, newPos: any, oldPos: any, orientation: Color): void {
    if (!this.doMove({from: source, to: target})) {
      throw new Error(`Illegal move played by local player - this shouldn't be possible!`);
    }
  }
  boundOnMove = this.onMove.bind(this);

  doMove(move: string | {from: Square, to: Square}) {
    this.game.move(move);
    if (this.game === null) {
      return false;
    }

    const gameOverReason = this.getGameOverReason();
    if (gameOverReason !== null) {
      let msg = `Game over! `;
      if (gameOverReason[0] === 'draw') {
        msg += `Draw by ${{
          'insufficient': 'insufficient material',
          'stalemate': 'stalemate',
          '50-move': '50-move rule',
          'repetition': 'threefold repetition',
        }[gameOverReason[1]]}.`;
      } else {
        msg += `${gameOverReason[0] === 'w' ? 'White' : 'Black'} wins by ${gameOverReason[1]}.`;
      }
      this.dialog.open(
        MsgboxComponent,
        {
          data: {
            description: msg,
          },
        },
      );
    }
    return true;
  }

}
