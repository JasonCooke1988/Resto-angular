import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoLayoutComponent } from './resto-layout.component';

describe('RestoLayoutComponent', () => {
  let component: RestoLayoutComponent;
  let fixture: ComponentFixture<RestoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestoLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
