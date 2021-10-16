import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DynamicTableService} from '../../dynamic-table.service';
import {FilterSettings} from '../../utils/interfaces/filter-settings';

@Component({
    selector: 'dt-filter-database',
    templateUrl: './filter-database.component.html',
    styleUrls: ['./filter-database.component.scss']
})
export class FilterDatabaseComponent implements OnInit, AfterViewInit {

    // @ts-ignore
    @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;
    public dataTable: any[] = [];
    public FilterSettings: FilterSettings = {
        debounceTime: 350,
        Reload: {
            icon: 'flash_on',
            color: 'orange'
        }
    };
    private urlData: string = '';
    private dataField: string | null = null;

    constructor(private dynamicTableService: DynamicTableService) {
    }

    ngOnInit(): void {
        this.dynamicTableService.configTableObservable.subscribe(config => {
            this.urlData = config.urlData;
            if (!!config?.dataField) this.dataField = config.dataField;
            if (!!config?.FilterSettings) this.FilterSettings = config.FilterSettings;
        });
        this.dynamicTableService.dataTableObservable.subscribe(dataTable => this.dataTable = dataTable);
    }

    public ngAfterViewInit(): void {
        fromEvent(this.filterInput.nativeElement, 'keyup')
            .pipe(debounceTime(this.FilterSettings.debounceTime), distinctUntilChanged())
            .subscribe(() => {
                if (this.dataTable.length > 0 && this.filterInput.nativeElement.value.length > 0) {
                    this.dynamicTableService.filterDataSource = this.filterInput.nativeElement.value.trim().toLowerCase();
                } else {
                    this.dynamicTableService.filterDataSource = '';
                }
            });
    }

    public reloadData(): void {
        this.clearFilter();
        this.dynamicTableService.loadData(this.urlData, this.dataField);
    }

    public clearFilter(): void {
        this.filterInput.nativeElement.value = '';
        this.dynamicTableService.filterDataSource = '';
    }
}
