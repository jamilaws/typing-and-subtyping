import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeConstructionKitComponent } from './type-construction-kit.component';

describe('TypeConstructionKitComponent', () => {
  let component: TypeConstructionKitComponent;
  let fixture: ComponentFixture<TypeConstructionKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeConstructionKitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeConstructionKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
