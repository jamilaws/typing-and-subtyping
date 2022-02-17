import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePointerTypeBubbleComponent } from './create-pointer-type-bubble.component';

describe('CreatePointerTypeBubbleComponent', () => {
  let component: CreatePointerTypeBubbleComponent;
  let fixture: ComponentFixture<CreatePointerTypeBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePointerTypeBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePointerTypeBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
