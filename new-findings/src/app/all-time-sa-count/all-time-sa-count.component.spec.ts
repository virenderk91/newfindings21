import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTimeSaCountComponent } from './all-time-sa-count.component';

describe('AllTimeSaCountComponent', () => {
  let component: AllTimeSaCountComponent;
  let fixture: ComponentFixture<AllTimeSaCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTimeSaCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTimeSaCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
