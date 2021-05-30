import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterDatabaseComponent} from './filter-database.component';

describe('FilterDatabaseComponent', () => {
    let component: FilterDatabaseComponent;
    let fixture: ComponentFixture<FilterDatabaseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FilterDatabaseComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterDatabaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
