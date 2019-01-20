import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DumbMsgComponent } from './dumb-msg.component';

describe('DumbMsgComponent', () => {
  let component: DumbMsgComponent;
  let fixture: ComponentFixture<DumbMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DumbMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DumbMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
