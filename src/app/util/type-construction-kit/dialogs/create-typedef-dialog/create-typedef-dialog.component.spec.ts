import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTypedefDialogComponent } from './create-typedef-dialog.component';

describe('CreateTypedefDialogComponent', () => {
  let component: CreateTypedefDialogComponent;
  let fixture: ComponentFixture<CreateTypedefDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTypedefDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTypedefDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
