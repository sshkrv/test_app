import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrichCsvComponent } from './enrich-csv.component';

describe('EnrichCsvComponent', () => {
  let component: EnrichCsvComponent;
  let fixture: ComponentFixture<EnrichCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrichCsvComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnrichCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
