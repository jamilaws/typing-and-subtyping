import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtypingTippsComponent } from './subtyping-tipps.component';

describe('SubtypingTippsComponent', () => {
  let component: SubtypingTippsComponent;
  let fixture: ComponentFixture<SubtypingTippsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtypingTippsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtypingTippsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
