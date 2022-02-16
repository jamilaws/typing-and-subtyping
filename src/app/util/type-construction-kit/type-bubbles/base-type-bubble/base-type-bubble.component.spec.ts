import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTypeBubbleComponent } from './base-type-bubble.component';

describe('BaseTypeBubbleComponent', () => {
  let component: BaseTypeBubbleComponent;
  let fixture: ComponentFixture<BaseTypeBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseTypeBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTypeBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
