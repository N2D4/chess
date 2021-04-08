import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChessPlayerInfoComponent } from './chess-player-info.component';

describe('ChessPlayerInfoComponent', () => {
  let component: ChessPlayerInfoComponent;
  let fixture: ComponentFixture<ChessPlayerInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessPlayerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessPlayerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
