import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedefTableComponent } from './typedef-table.component';

describe('TypedefTableComponent', () => {
  let component: TypedefTableComponent;
  let fixture: ComponentFixture<TypedefTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypedefTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypedefTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
