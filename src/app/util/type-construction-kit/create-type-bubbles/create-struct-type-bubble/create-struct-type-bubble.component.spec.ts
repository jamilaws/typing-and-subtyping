import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStructTypeBubbleComponent } from './create-struct-type-bubble.component';

describe('CreateStructTypeBubbleComponent', () => {
  let component: CreateStructTypeBubbleComponent;
  let fixture: ComponentFixture<CreateStructTypeBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStructTypeBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStructTypeBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
