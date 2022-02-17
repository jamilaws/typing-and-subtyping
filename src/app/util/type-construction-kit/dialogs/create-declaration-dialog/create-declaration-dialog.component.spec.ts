import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeclarationDialogComponent } from './create-declaration-dialog.component';

describe('CreateDeclarationDialogComponent', () => {
  let component: CreateDeclarationDialogComponent;
  let fixture: ComponentFixture<CreateDeclarationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDeclarationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDeclarationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
