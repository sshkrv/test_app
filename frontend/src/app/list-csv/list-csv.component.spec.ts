import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCsvComponent } from './list-csv.component';

describe('ListCsvComponent', () => {
  let component: ListCsvComponent;
  let fixture: ComponentFixture<ListCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCsvComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
