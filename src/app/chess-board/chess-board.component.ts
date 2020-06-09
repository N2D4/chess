import { Component, OnInit, ViewChild, ElementRef, OnChanges, Input, SimpleChanges, AfterViewInit } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import {Square, Piece, Color} from '../../chess-types';


let chessboardsCreated = 0;

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() position: string;
  @Input() checkPreventPickUp: (source: Square, piece: Piece, pos: any, orientation: Color) => boolean = () => false;
  @Input() checkPreventMove: (source: Square, target: Square, piece: Piece, newPos: any, oldPos: any, orientation: Color) => boolean = () => false;
  @Input() onMove: (source: Square, target: Square, piece: Piece, newPos: any, oldPos: any, orientation: Color) => void = () => {};

  @ViewChild('board') boardElement: ElementRef;
  board: any = null;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.createBoard();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.board === null) {
      if (this.boardElement) {
        this.createBoard();
      }
    } else {
      this.board.position(changes.position.currentValue);
    }
  }

  private createBoard() {
    const id = 'n2d4-chess-cb-' + chessboardsCreated++;
    this.boardElement.nativeElement.id = id;

    this.board = new (globalThis as any).Chessboard(id, {
      position: this.position,
      draggable: true,
      pieceTheme: 'assets/chesspieces/wikipedia/{piece}.svg',
      onDragStart: (source, piece, pos, orientation) => {
        return !this.checkPreventPickUp(source, piece, pos, orientation);
      },
      onDrop: (source, target, piece, newPos, oldPos, orientation) => {
        if (this.checkPreventMove(source, target, piece, newPos, oldPos, orientation)) {
          return 'snapback';
        }
        this.onMove(source, target, piece, newPos, oldPos, orientation);
      }
    });

    new ResizeObserver((changes) => {
      if (changes.length > 0) {
        this.board.resize();
      }
    }).observe(this.boardElement.nativeElement);
  }

}
