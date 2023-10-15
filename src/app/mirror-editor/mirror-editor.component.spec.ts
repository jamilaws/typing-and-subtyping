import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MirrorEditorComponent } from './mirror-editor.component';

describe('MirrorEditorComponent', () => {
  let component: MirrorEditorComponent;
  let fixture: ComponentFixture<MirrorEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MirrorEditorComponent]
    });
    fixture = TestBed.createComponent(MirrorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
