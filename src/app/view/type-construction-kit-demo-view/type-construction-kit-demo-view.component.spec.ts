import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeConstructionKitDemoViewComponent } from './type-construction-kit-demo-view.component';

describe('TypeConstructionKitDemoViewComponent', () => {
  let component: TypeConstructionKitDemoViewComponent;
  let fixture: ComponentFixture<TypeConstructionKitDemoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeConstructionKitDemoViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeConstructionKitDemoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
