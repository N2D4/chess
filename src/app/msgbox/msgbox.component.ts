import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-msgbox',
  templateUrl: './msgbox.component.html',
  styleUrls: ['./msgbox.component.scss']
})
export class MsgboxComponent implements OnInit {
  title?: string;
  description: string;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.title = data.title;
    this.description = data.description;
  }

  ngOnInit(): void {
  }

}
