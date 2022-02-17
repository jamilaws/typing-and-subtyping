import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliasTypeBubbleComponent } from './alias-type-bubble.component';

describe('AliasTypeBubbleComponent', () => {
  let component: AliasTypeBubbleComponent;
  let fixture: ComponentFixture<AliasTypeBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliasTypeBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AliasTypeBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
