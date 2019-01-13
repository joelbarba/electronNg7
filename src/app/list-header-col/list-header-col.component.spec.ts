import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHeaderColComponent } from './list-header-col.component';

describe('ListHeaderColComponent', () => {
  let component: ListHeaderColComponent;
  let fixture: ComponentFixture<ListHeaderColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListHeaderColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHeaderColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
