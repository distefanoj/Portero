import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorteroComponent } from './portero.component';

describe('PorteroComponent', () => {
  let component: PorteroComponent;
  let fixture: ComponentFixture<PorteroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorteroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorteroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
