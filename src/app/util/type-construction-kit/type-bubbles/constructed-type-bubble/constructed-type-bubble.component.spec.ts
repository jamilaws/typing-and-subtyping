import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructedTypeBubbleComponent } from './constructed-type-bubble.component';

describe('ConstructedTypeBubbleComponent', () => {
  let component: ConstructedTypeBubbleComponent;
  let fixture: ComponentFixture<ConstructedTypeBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructedTypeBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructedTypeBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
