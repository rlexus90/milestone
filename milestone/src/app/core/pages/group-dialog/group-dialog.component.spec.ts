import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDialogComponent } from './group-dialog.component';

describe('GroupDialogComponent', () => {
  let component: GroupDialogComponent;
  let fixture: ComponentFixture<GroupDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupDialogComponent],
    });
    fixture = TestBed.createComponent(GroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
