import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationsTableComponent } from './declarations-table.component';

describe('DeclarationsTableComponent', () => {
  let component: DeclarationsTableComponent;
  let fixture: ComponentFixture<DeclarationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclarationsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
