import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFunctionTypeBubbleComponent } from './create-function-type-bubble.component';

describe('CreateFunctionTypeBubbleComponent', () => {
  let component: CreateFunctionTypeBubbleComponent;
  let fixture: ComponentFixture<CreateFunctionTypeBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFunctionTypeBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFunctionTypeBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
