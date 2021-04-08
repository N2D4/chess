import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChessGameInfoComponent } from './chess-game-info.component';

describe('ChessGameInfoComponent', () => {
  let component: ChessGameInfoComponent;
  let fixture: ComponentFixture<ChessGameInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessGameInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessGameInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
