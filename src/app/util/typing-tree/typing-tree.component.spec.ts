import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingTreeComponent } from './typing-tree.component';

describe('TypingTreeComponent', () => {
  let component: TypingTreeComponent;
  let fixture: ComponentFixture<TypingTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypingTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypingTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
