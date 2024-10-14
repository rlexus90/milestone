import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGreateGroupComponent } from './dialog-greate-group.component';

describe('DialogGreateGroupComponent', () => {
  let component: DialogGreateGroupComponent;
  let fixture: ComponentFixture<DialogGreateGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogGreateGroupComponent],
    });
    fixture = TestBed.createComponent(DialogGreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
