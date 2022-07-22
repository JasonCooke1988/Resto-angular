import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutControlsComponent } from './layout-controls.component';

describe('ControlsComponent', () => {
  let component: LayoutControlsComponent;
  let fixture: ComponentFixture<LayoutControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
