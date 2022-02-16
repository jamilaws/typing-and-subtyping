import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePointerDialogComponent } from './create-pointer-dialog.component';

describe('CreatePointerDialogComponent', () => {
  let component: CreatePointerDialogComponent;
  let fixture: ComponentFixture<CreatePointerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePointerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePointerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
