import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArrayTypeBubbleComponent } from './create-array-type-bubble.component';

describe('CreateArrayTypeBubbleComponent', () => {
  let component: CreateArrayTypeBubbleComponent;
  let fixture: ComponentFixture<CreateArrayTypeBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateArrayTypeBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateArrayTypeBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
