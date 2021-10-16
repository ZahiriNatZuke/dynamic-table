import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from './lib/table-data-source';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DynamicTableService} from './dynamic-table.service';
import {Grouping, MatGroupBy} from './lib/group-by';
import {Observable} from 'rxjs';
import {Column, ColumnType} from './utils/interfaces/column';
import {GroupingColumn} from './utils/interfaces/grouping-column';
import {InputConfig} from './utils/interfaces/input-config';
import {OperationEvent, TypeOpEvent} from './utils/interfaces/operation-event';
import {NestedPropertyPipe} from './utils/pipes/nested-property.pipe';
import {OptionSettings} from './utils/interfaces/option-settings';
import {SpinnerSettings} from './utils/interfaces/spinner-settings';
import {PaginatorSettings} from './utils/interfaces/paginator-settings';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmMessageComponent} from './components/confirm-message/confirm-message.component';

@Component({
    selector: 'dynamic-table',
    templateUrl: './dynamic-table.component.html',
    styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {

    @Output() operationEvent: EventEmitter<OperationEvent> = new EventEmitter<OperationEvent>();
    public dataSource = new MatTableDataSource<any>();
    public isLoading$ = new Observable<boolean>();

    public columnType = ColumnType;
    public typeOpEvent = TypeOpEvent;
    public displayedColumns: Column[] = [];
    public columns: string[] = [];
    public showOpCRUD = false;
    public showOpNew: boolean | undefined = false;
    public showOpEdit: boolean | undefined = false;
    public showOpDelete: boolean | undefined = false;
    public showOpSelect: boolean | undefined = false;
    public canSticky: boolean | undefined = false;
    public startFieldSticky: string | undefined;
    public OptionSettings: OptionSettings = {
        iconNew: 'add_circle',
        Update: {
            icon: 'edit',
            literal: 'Actualizar',
            color: '#388E3C'
        },
        Delete: {
            icon: 'delete',
            literal: 'Eliminar',
            color: '#F44336'
        }
    };
    public showFilter: boolean = false;
    public SpinnerSettings: SpinnerSettings = {
        color: 'primary',
        diameter: 100,
        strokeWidth: 2
    };
    public showPaginator: boolean = false;
    public PaginatorSettings: PaginatorSettings = {
        pageSize: 10,
        pageSizeOptions: [5, 20, 50, 100]
    };
    private inputConfig: InputConfig | undefined;
    private groupingColumns: GroupingColumn[] = [];
    private urlData = '';
    private dataField: string | null = null;
    private endFieldSticky: string | undefined;
    private paginator: MatPaginator | undefined;
    private sort: MatSort | undefined;

    constructor(public dynamicTableService: DynamicTableService, public matGroupBy: MatGroupBy,
                private dialog: MatDialog) {
        this.isLoading$ = this.dynamicTableService.loadingObservable;
        this.dynamicTableService.configTableObservable.subscribe(config => {
            this.inputConfig = config;
            this.displayedColumns = DynamicTableComponent.filterColumns(this.inputConfig?.displayedColumns);
            this.columns = this.displayedColumns.map(column => column.column);

            this.loadConfiguration();

            if (this.showOpCRUD || this.showOpSelect) this.columns = [...this.columns, 'op'];
        });
    }

    @ViewChild(MatPaginator) set MatPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.dataSource.paginator = this.paginator;
    }

    @ViewChild(MatSort) set MatSort(sr: MatSort) {
        this.sort = sr;
        this.dataSource.sort = this.sort;
    }

    private static filterColumns(displayedColumns: Column[]): Column[] {
        return displayedColumns.filter(elm => elm.show);
    }

    public ngOnInit(): void {
        this.dynamicTableService.loadData(this.urlData, this.dataField);
        this.dataSource.paginator = this.paginator;
        this.matGroupBy.grouping = new Grouping(this.groupingColumns);
        this.dataSource.groupBy = this.matGroupBy;

        this.dynamicTableService.dataTableObservable.subscribe(data => this.dataSource.data = data);
        this.dataSource.filterPredicate = (data: Element, filter: string) => {
            let out = false;
            this.displayedColumns.forEach(col => {
                const value = new NestedPropertyPipe().transform(data, col.column)?.toString();
                if (!!value && value.toLowerCase()?.includes(filter.trim().toLowerCase())) {
                    out = true;
                    return;
                }
            });
            return out;
        };
        this.dynamicTableService.dataSource = this.dataSource;
        this.dynamicTableService.dataSourceObservable.subscribe(dataSource => this.dataSource = dataSource);
    }

    public option(Operation: TypeOpEvent, value?: number | string | any): void {
        if (Operation === TypeOpEvent.Delete) {
            const dialogRef = this.dialog.open(ConfirmMessageComponent);
            dialogRef.afterClosed().subscribe(result => {
                if (result) this.operationEvent.emit({type: Operation, value: value || null});
            });
        } else {
            this.operationEvent.emit({type: Operation, value: value || null});
        }
    }

    public canBeStartSticky(column: string): false | undefined | boolean {
        return this.canSticky && (this.startFieldSticky === column);
    }

    public canBeEndSticky(column: string): false | undefined | boolean {
        return this.canSticky && (this.endFieldSticky === column);
    }

    public loadConfiguration(): void {
        if (!!this.inputConfig?.groupingColumns) this.groupingColumns = this.inputConfig.groupingColumns;
        if (!!this.inputConfig?.urlData) this.urlData = this.inputConfig.urlData;
        if (!!this.inputConfig?.showOpCRUD) this.showOpCRUD = this.inputConfig.showOpCRUD;
        if (!!this.inputConfig?.showOpNew) this.showOpNew = this.inputConfig.showOpNew;
        if (!!this.inputConfig?.showOpEdit) this.showOpEdit = this.inputConfig.showOpEdit;
        if (!!this.inputConfig?.showOpDelete) this.showOpDelete = this.inputConfig.showOpDelete;
        if (!!this.inputConfig?.showOpSelect) this.showOpSelect = this.inputConfig.showOpSelect;
        if (!!this.inputConfig?.canSticky) this.canSticky = this.inputConfig.canSticky;
        if (!!this.inputConfig?.startFieldSticky) this.startFieldSticky = this.inputConfig.startFieldSticky;
        if (!!this.inputConfig?.endFieldSticky) this.endFieldSticky = this.inputConfig.endFieldSticky;
        if (!!this.inputConfig?.dataField) this.dataField = this.inputConfig.dataField;
        if (!!this.inputConfig?.OptionSettings) this.OptionSettings = this.inputConfig.OptionSettings;
        if (!!this.inputConfig?.SpinnerSettings) this.SpinnerSettings = this.inputConfig.SpinnerSettings;
        if (!!this.inputConfig?.showFilter) this.showFilter = this.inputConfig.showFilter;
        if (!!this.inputConfig?.showPaginator) this.showPaginator = this.inputConfig.showPaginator;
        if (!!this.inputConfig?.PaginatorSettings) this.PaginatorSettings = this.inputConfig.PaginatorSettings;
    }
}
