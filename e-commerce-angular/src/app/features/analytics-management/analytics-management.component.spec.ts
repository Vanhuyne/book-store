import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsManagementComponent } from './analytics-management.component';

describe('AnalyticsManagementComponent', () => {
  let component: AnalyticsManagementComponent;
  let fixture: ComponentFixture<AnalyticsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalyticsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
