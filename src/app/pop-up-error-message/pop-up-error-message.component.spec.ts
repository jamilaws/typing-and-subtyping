import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpErrorMessageComponent } from './pop-up-error-message.component';

describe('PopUpErrorMessageComponent', () => {
  let component: PopUpErrorMessageComponent;
  let fixture: ComponentFixture<PopUpErrorMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpErrorMessageComponent]
    });
    fixture = TestBed.createComponent(PopUpErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
