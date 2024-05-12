import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleFieldsComponent } from './sample-fields.component';

describe('SampleFieldsComponent', () => {
  let component: SampleFieldsComponent;
  let fixture: ComponentFixture<SampleFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
