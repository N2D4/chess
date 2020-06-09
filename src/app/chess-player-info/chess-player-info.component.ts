import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chess-player-info',
  templateUrl: './chess-player-info.component.html',
  styleUrls: ['./chess-player-info.component.scss']
})
export class ChessPlayerInfoComponent implements OnInit {
  @Input() name: string;
  @Input() msTime: number;
  @Input() isTicking: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
