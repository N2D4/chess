import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChessViewComponent } from './chess-view.component';

describe('ChessViewComponent', () => {
  let component: ChessViewComponent;
  let fixture: ComponentFixture<ChessViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
