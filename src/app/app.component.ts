import {Component, OnInit} from '@angular/core';
import {InputConfig} from './dynamic-table/utils/interfaces/input-config';
import {ColumnType} from './dynamic-table/utils/interfaces/column';
import {DynamicTableService} from './dynamic-table/dynamic-table.service';
import {OperationEvent} from './dynamic-table/utils/interfaces/operation-event';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public dataTable: any[] = [];
    private urlData: string = 'https://jsonplaceholder.typicode.com/users';
    public inputConfig: InputConfig = {
        displayedColumns: [
            {
                header: 'Full Name',
                column: 'name',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'Username',
                column: 'username',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'Email',
                column: 'email',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'Website',
                column: 'website',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'City',
                column: 'address.city',
                show: true,
                type: ColumnType.Regular
            },
            {
                header: 'Phone',
                column: 'phone',
                show: true,
                type: ColumnType.Regular
            },
        ],
        groupingColumns: [],
        showOpNew: true,
        showOptions: true,
        urlData: this.urlData,
        OptionSettings: {
            iconNew: 'add_circle_outlined',
            eventNew: 'Create',
            options: [
                {
                    icon: 'edit',
                    literal: 'Update',
                    color: '#388E3C',
                    event: 'Update'
                },
                {
                    icon: 'delete_outlined',
                    literal: 'Delete',
                    color: '#F44336',
                    event: 'Delete'
                }
            ]
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

    constructor(private dynamicTableService: DynamicTableService) {
        this.dynamicTableService.configTable = this.inputConfig;
    }

    public ngOnInit(): void {
        this.dynamicTableService.configTableObservable.subscribe(config => this.inputConfig = config);
        this.dynamicTableService.dataTableObservable.subscribe(dataTable => this.dataTable = dataTable);
    }

    public triggerOption(event: OperationEvent): void {
        switch (event.type) {

        }
    }
}
