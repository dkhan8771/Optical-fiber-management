import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleGraphComponent } from './sample-graph.component';

describe('SampleGraphComponent', () => {
  let component: SampleGraphComponent;
  let fixture: ComponentFixture<SampleGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
