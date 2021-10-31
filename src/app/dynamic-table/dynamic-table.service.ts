import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from './lib/table-data-source';
import {InputConfig} from './utils/interfaces/input-config';
import {Column} from './utils/interfaces/column';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmMessageComponent} from './components/confirm-message/confirm-message.component';

@Injectable({providedIn: 'root'})
export class DynamicTableService {

    // @ts-ignore
    private _inputConfig: BehaviorSubject<InputConfig> = new BehaviorSubject<InputConfig>(null);

    constructor(private _httpClient: HttpClient, private _matDialog: MatDialog) {
    }

    // @ts-ignore
    private _dataSource: BehaviorSubject<MatTableDataSource<any>> = new BehaviorSubject<MatTableDataSource<any>>(null);

    set dataSource(newData: MatTableDataSource<any>) {
        this._dataSource.next(newData);
    }

    private _dataTable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    set dataTable(newData: any[]) {
        this._dataTable.next(newData);
    }

    private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    set loading(newStatus: boolean) {
        this._loading.next(newStatus);
    }

    get dataSourceObservable(): Observable<MatTableDataSource<any>> {
        return this._dataSource.asObservable();
    }

    set filterDataSource(filter: string) {
        let newValue: MatTableDataSource<any> = this._dataSource.value;
        newValue.filter = filter;
        this._dataSource.next(newValue);
    }

    get dataTableObservable(): Observable<any[]> {
        return this._dataTable.asObservable();
    }

    get loadingObservable(): Observable<boolean> {
        return this._loading.asObservable();
    }

    get configTableObservable(): Observable<InputConfig> {
        return this._inputConfig.asObservable();
    }

    get configTableValue(): InputConfig {
        return this._inputConfig.value;
    }

    set configTable(newConfig: InputConfig) {
        this._inputConfig.next(newConfig);
    }

    set updateColumnsShow(newColumns: Column[]) {
        const newConfig = {...this.configTableValue};
        newConfig.displayedColumns = newColumns;
        this.configTable = newConfig;
    }

    public loadData(url: string, dataField: string | null = null) {
        this.loading = true;
        this._httpClient.get<any>(url).subscribe(res => {
            this.dataTable = dataField === null ? res : res[dataField];
            this.loading = false;
        });
    }

    public mapData(data: any[], prop: string | undefined, join: string = ',') {
        if (prop)
            return data.filter(i => i[prop] !== null && i[prop] !== undefined).map(e => e[prop]).join(`${join} `);
        else return '';
    }

    public truncateAtWord(input: string, length: number) {
        if (input === null || input.length < length) return input;

        const iNextSpace = input.lastIndexOf(' ', length);
        return `${input.substring(0, iNextSpace > 0 ? iNextSpace : length).trim()} ...`;
    }

    public openConfirmDialog() {
        const dialog = this._matDialog.open(ConfirmMessageComponent);
        return dialog.afterClosed();
    }
}
