import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsSubtypingComponent } from './instructions-subtyping.component';

describe('InstructionsSubtypingComponent', () => {
  let component: InstructionsSubtypingComponent;
  let fixture: ComponentFixture<InstructionsSubtypingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionsSubtypingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructionsSubtypingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
