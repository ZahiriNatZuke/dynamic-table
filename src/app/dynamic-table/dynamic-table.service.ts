import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from './lib/table-data-source';
import {InputConfig} from './utils/interfaces/input-config';
import {NestedPropertyPipe} from './utils/pipes/nested-property.pipe';
import {Column, ColumnType} from './utils/interfaces/column';
import {UtilCSV} from './lib/export-to-csv';

@Injectable({providedIn: 'root'})
export class DynamicTableService {

    // @ts-ignore
    private _dataSource: BehaviorSubject<MatTableDataSource<any>> = new BehaviorSubject<MatTableDataSource<any>>(null);
    private _dataTable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // @ts-ignore
    private _inputConfig: BehaviorSubject<InputConfig> = new BehaviorSubject<InputConfig>(null);

    constructor(private _httpClient: HttpClient) {
    }

    get dataSourceObservable(): Observable<MatTableDataSource<any>> {
        return this._dataSource.asObservable();
    }

    set dataSource(newData: MatTableDataSource<any>) {
        this._dataSource.next(newData);
    }

    set filterDataSource(filter: string) {
        let newValue: MatTableDataSource<any> = this._dataSource.value;
        newValue.filter = filter;
        this._dataSource.next(newValue);
    }

    get dataTableObservable(): Observable<any[]> {
        return this._dataTable.asObservable();
    }

    set dataTable(newData: any[]) {
        this._dataTable.next(newData);
    }

    get loadingObservable(): Observable<boolean> {
        return this._loading.asObservable();
    }

    set loading(newStatus: boolean) {
        this._loading.next(newStatus);
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

    public ExportDataToCSV(nameReport: string) {
        const dataFiltered: Column[] = this.configTableValue.displayedColumns.filter(col => col.show);
        const headers: string[] = dataFiltered.map(col => col.header);
        let data = [...this._dataTable.value];
        let dataCSV: any[] = [];
        data.forEach(col => {
            let obj: any = {};
            headers.forEach((prop, index) => {
                switch (dataFiltered[index].type) {
                    case ColumnType.Regular:
                        obj['"' + prop + '"'] = new NestedPropertyPipe().transform(col, dataFiltered[index].column) || '';
                        break;
                    case ColumnType.Concat:
                        const valueConcat = new NestedPropertyPipe().transform(col, dataFiltered[index].column);
                        obj['"' + prop + '"'] = this.mapData(valueConcat, dataFiltered[index].prop);
                        break;
                    case ColumnType.Bullets:
                        const valueBullets = new NestedPropertyPipe().transform(col, dataFiltered[index].column);
                        obj['"' + prop + '"'] = this.mapData(valueBullets, dataFiltered[index].prop, ';');
                        break;
                    case ColumnType.Boolean:
                        const valueBoolean = new NestedPropertyPipe().transform(col, dataFiltered[index].column);
                        obj['"' + prop + '"'] = valueBoolean ? 'Si' : 'No';
                        break;
                }
            });
            dataCSV.push(obj);
        });

        const options = {
            quoteStrings: '"', useBom: true, noDownload: false, headers: headers, eol: '\n',
        };

        UtilCSV.prototype.exportDataCSV(dataCSV, nameReport, options);
    }

    public convertDateUTCToLocaleDateTime(dateUTC: any) {
        if (dateUTC === undefined || dateUTC === null) return;
        dateUTC = dateUTC.replace('Z', '');
        return new Date(dateUTC + 'Z').toLocaleDateString() + ' ' + new Date(dateUTC + 'Z').toLocaleTimeString();
    }
}
