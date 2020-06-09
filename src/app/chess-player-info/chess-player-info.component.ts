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
  @Input() darkTheme: boolean;

  constructor() { }

  ngOnInit(): void {

  }

  formattedTime(): string {
    const mst = Math.max(this.msTime, 0);
    const minutes = Math.floor(mst / 60_000);
    const seconds = Math.floor(mst / 1_000 % 60);
    const deciles = Math.floor(mst / 100 % 10);
    if (mst >= 20_000) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${deciles}`;
    }
  }

}
