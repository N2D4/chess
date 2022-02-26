import { Component, OnInit, OnDestroy } from '@angular/core';
import { Square, Piece, Color, PromotionChoice } from '../../chess-types';
import { MatDialog } from '@angular/material/dialog';
import { MsgboxComponent } from '../msgbox/msgbox.component';
import { LocalPlayerFactory } from '../../chess-players/local-player';
import { ChessPlayer } from 'src/chess-players/chess-player';
import { RandomizerPlayerFactory } from 'src/chess-players/randomizer-player';
import { TannerPlayerFactory } from 'src/chess-players/tanner-player';

const Chess = (globalThis as any).Chess;
const pid = (c: string) => Number(c === 'b' || c === 'B');

@Component({
  selector: 'app-chess-view',
  templateUrl: './chess-view.component.html',
  styleUrls: ['./chess-view.component.scss'],
})
export class ChessViewComponent implements OnInit, OnDestroy {
  game = new Chess();
  players: [ChessPlayer, ChessPlayer] =
    Math.random() < 0.5
      ? [LocalPlayerFactory('Player', 600_000, 5_000), TannerPlayerFactory()]
      : [TannerPlayerFactory(), LocalPlayerFactory('Player', 600_000, 5_000)];
  timeRemaining: number[];
  isFlipped: boolean;
  globalThis = globalThis; // for us to access global variables inside Angular templates

  private turnStart: number | null = null;
  private tickIntervalId: any;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.timeRemaining = this.players.map((p) => p.msStartTime);
    this.isFlipped =
      this.players[0].makeMove !== 'local' &&
      this.players[1].makeMove === 'local';
    this.tickIntervalId = setInterval(() => this.tickClock(), 50);
    this.onTurn();
  }

  ngOnDestroy(): void {
    clearInterval(this.tickIntervalId);
  }

  getGameClone(): any {
    const gameClone = new Chess();
    gameClone.load_pgn(this.game.pgn());
    return gameClone;
  }

  tickClock(): boolean {
    if (this.isGameOver()) {
      return true;
    }
    if (this.turnStart === null) {
      return false;
    }

    const p = pid(this.game.turn());
    const newTime = performance.now();

    const dif = newTime - this.turnStart;
    this.timeRemaining[p] -= dif;
    this.turnStart = newTime;

    return this.handleGameOver();
  }

  isGameOver() {
    return this.getGameOverReason() !== null;
  }

  getGameOverReason():
    | null
    | ['w' | 'b', 'time' | 'checkmate']
    | [
        'draw',
        'insufficient' | 'stalemate' | 'repetition' | '50-move' | 'time'
      ] {
    if (this.game.in_checkmate()) {
      return [this.game.turn() === 'w' ? 'b' : 'w', 'checkmate'];
    } else if (this.game.in_draw()) {
      return [
        'draw',
        this.game.in_threefold_repetition()
          ? 'repetition'
          : this.game.in_stalemate()
          ? 'stalemate'
          : this.game.insufficient_material()
          ? 'insufficient'
          : '50-move',
      ];
    }

    const timeoutedPlayers = [0, 1].filter((i) => this.timeRemaining[i] <= 0);
    if (timeoutedPlayers.length >= 2) {
      throw new Error(`Double time-out - this shouldn't ever happen!`);
    } else if (timeoutedPlayers.length === 1) {
      const other = 1 - timeoutedPlayers[0];
      const otherChar = other ? 'b' : 'w';
      // We use chess.com instead of FIDE rules to check for draws on timeout // TODO use FIDE instead?
      const remainingPieces = this.game
        .board()
        .flatMap((a) =>
          a
            .filter((b) => b !== null && b.color === otherChar)
            .map((b) => b.type)
        )
        .sort()
        .join();
      if (
        remainingPieces === 'k' ||
        remainingPieces === 'kn' ||
        remainingPieces === 'bk'
      ) {
        return ['draw', 'time'];
      }
      return [otherChar, 'time'];
    }

    return null;
  }

  handleGameOver(): boolean {
    const gameOverReason = this.getGameOverReason();
    if (gameOverReason !== null) {
      let msg = `Game over! `;
      if (gameOverReason[0] === 'draw') {
        msg += `Draw by ${
          {
            insufficient: 'insufficient material',
            stalemate: 'stalemate',
            '50-move': '50-move rule',
            repetition: 'threefold repetition',
            time: 'timeout with insufficient material',
          }[gameOverReason[1]]
        }.`;
      } else {
        msg += `${gameOverReason[0] === 'w' ? 'White' : 'Black'} wins by ${
          gameOverReason[1]
        }.`;
      }
      this.dialog.open(MsgboxComponent, {
        data: {
          description: msg,
        },
      });
      return true;
    }
    return false;
  }

  checkPreventPickUp(
    source: Square,
    piece: Piece,
    pos: any,
    orientation: Color
  ): boolean {
    return (
      this.isGameOver() || this.players[pid(piece[0])].makeMove !== 'local'
    );
  }
  boundCheckPreventPickUp = this.checkPreventPickUp.bind(this);

  checkPreventMove(
    source: Square,
    target: Square,
    piece: Piece,
    newPos: any,
    oldPos: any,
    orientation: Color
  ): boolean {
    if (this.players[pid(piece[0])].makeMove !== 'local') {
      return true;
    }
    const gameClone = this.getGameClone();
    if (!gameClone.move({ from: source, to: target, promotion: 'q' })) {
      return true;
    }
    return false;
  }
  boundCheckPreventMove = this.checkPreventMove.bind(this);

  onMove(
    source: Square,
    target: Square,
    piece: Piece,
    newPos: any,
    oldPos: any,
    orientation: Color
  ): void {
    if (
      this.doMove({ from: source, to: target, promotion: 'q' }) === 'illegal'
    ) {
      throw new Error(
        `Illegal move played by local player - this shouldn't be possible!`
      );
    }
  }
  boundOnMove = this.onMove.bind(this);

  doMove(
    move: string | { from: Square; to: Square; promotion?: PromotionChoice }
  ): 'ok' | 'illegal' | 'timeout' {
    if (this.tickClock()) {
      return 'timeout';
    }

    const moveObj = this.game.move(move);
    if (moveObj === null) {
      return 'illegal';
    }

    const id = pid(moveObj.color);
    this.timeRemaining[id] += this.players[id].msIncrement;

    this.players.forEach((p, i) => p.onMove(moveObj.from, moveObj.to, null));
    this.turnStart = performance.now();

    if (this.handleGameOver()) {
      return 'ok';
    }

    this.onTurn();
    return 'ok';
  }

  onTurn() {
    const p = pid(this.game.turn());
    const makeMove = this.players[p].makeMove;
    if (makeMove !== 'local') {
      (async () => {
        const move = await makeMove(this.getGameClone());
        if (this.doMove(move) === 'illegal') {
          throw new Error(
            `Illegal move ${JSON.stringify(
              move
            )} played - this shouldn't happen!`
          );
        }
      })();
    }
  }
}
