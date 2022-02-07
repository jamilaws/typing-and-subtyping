import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummySubtypingTestComponent } from './dummy-subtyping-test.component';

describe('DummySubtypingTestComponent', () => {
  let component: DummySubtypingTestComponent;
  let fixture: ComponentFixture<DummySubtypingTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DummySubtypingTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummySubtypingTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
