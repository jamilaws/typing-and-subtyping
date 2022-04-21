import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructTypeConstructionBubbleComponent } from './create-struct-type-bubble.component';

describe('CreateStructTypeBubbleComponent', () => {
  let component: StructTypeConstructionBubbleComponent;
  let fixture: ComponentFixture<StructTypeConstructionBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructTypeConstructionBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructTypeConstructionBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
