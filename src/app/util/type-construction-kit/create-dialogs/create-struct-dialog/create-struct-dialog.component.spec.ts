import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStructDialogComponent } from './create-struct-dialog.component';

describe('CreateStructDialogComponent', () => {
  let component: CreateStructDialogComponent;
  let fixture: ComponentFixture<CreateStructDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStructDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStructDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
