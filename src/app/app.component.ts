import {Component, OnInit} from '@angular/core';
import {InputConfig} from './dynamic-table/utils/interfaces/input-config';
import {ColumnType} from './dynamic-table/utils/interfaces/column';
import {DynamicTableService} from './dynamic-table/dynamic-table.service';
import {OperationEvent, TypeOpEvent} from './dynamic-table/utils/interfaces/operation-event';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public dataTable: any[] = [];
    private urlData: string = 'http://localhost:3000/people';
    public inputConfig: InputConfig = {
        displayedColumns: [
            {
                header: 'surname',
                column: 'surname',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'forename',
                column: 'forename',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'gender',
                column: 'gender',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'ukCity',
                column: 'ukCity',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'salary',
                column: 'salary',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'department',
                column: 'department',
                show: true,
                type: ColumnType.Regular
            },
        ],
        groupingColumns: [],
        showOpCRUD: true,
        showOpEdit: true,
        showOpExport: false,
        urlData: this.urlData,
        showOpNew: true,
        showOpDelete: true,
        OptionSettings: {
            iconNew: 'add_circle_outlined',
            Update: {
                icon: 'edit',
                literal: 'Update'
            },
            Delete: {
                icon: 'delete_outlined',
                literal: 'Delete'
            }
        },
        SpinnerSettings: {
            color: 'primary',
            diameter: 80,
            strokeWidth: 4
        },
        showFilter: true,
        FilterSettings: {
            debounceTime: 150,
            Reload: {
                icon: 'restart_alt',
                color: 'blue'
            }
        },
        showPaginator: true,
        PaginatorSettings: {
            pageSize: 5,
            pageSizeOptions: [5, 10, 20]
        },
        showOpSelect: true,
        SelectorSettings: {
            label: 'Select Columns',
            singularLiteral: 'other',
            pluralLiteral: 'others',
            appearance: 'standard'
        },
        ConfirmSettings: {
            title: 'Elimination Control',
            content: `<p>⚠Warning: Are you sure do you want to <b>eliminate</b> this item?</p>`,
            Accept: {
                color: 'primary',
                literal: 'Accept'
            },
            Cancel: {
                color: 'accent',
                literal: 'Cancel'
            }
        }
    };
    private reportName: string = 'CSV_report_example';

    constructor(private dynamicTableService: DynamicTableService) {
        this.dynamicTableService.configTable = this.inputConfig;
    }

    public ngOnInit(): void {
        this.dynamicTableService.configTableObservable.subscribe(config => this.inputConfig = config);
        this.dynamicTableService.dataTableObservable.subscribe(dataTable => this.dataTable = dataTable);
    }

    public triggerOption(event: OperationEvent): void {
        switch (event.type) {
            case TypeOpEvent.New:
                break;
            case TypeOpEvent.Update:
                break;
            case TypeOpEvent.Delete:
                break;
        }
    }

    public exportCSV(): void {
        this.dynamicTableService.ExportDataToCSV(this.reportName);
    }
}
