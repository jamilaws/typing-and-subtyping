import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAliasTypeBubbleComponent } from './create-alias-type-bubble.component';

describe('CreateAliasTypeBubbleComponent', () => {
  let component: CreateAliasTypeBubbleComponent;
  let fixture: ComponentFixture<CreateAliasTypeBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAliasTypeBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAliasTypeBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
