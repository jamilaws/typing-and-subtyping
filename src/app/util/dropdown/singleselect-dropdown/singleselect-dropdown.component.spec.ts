import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleselectDropdownComponent } from './singleselect-dropdown.component';

describe('SingleselectDropdownComponent', () => {
  let component: SingleselectDropdownComponent;
  let fixture: ComponentFixture<SingleselectDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleselectDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleselectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
