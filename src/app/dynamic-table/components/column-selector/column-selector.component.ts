import {Component} from '@angular/core';
import {DynamicTableService} from '../../dynamic-table.service';
import {Column} from '../../utils/interfaces/column';
import {SelectorSettings} from '../../utils/interfaces/selector-settings';

@Component({
    selector: 'dt-column-selector',
    templateUrl: './column-selector.component.html',
    styleUrls: ['./column-selector.component.scss']
})
export class ColumnSelectorComponent {
    public columnList: Column[] = [];
    public selectedValues: string[] = [];
    public SelectorSettings: SelectorSettings = {
        label: 'Select Columns',
        singularLiteral: 'other',
        pluralLiteral: 'others',
        appearance: 'outline'
    };

    constructor(private dynamicTableService: DynamicTableService) {
        this.dynamicTableService.configTableObservable.subscribe(config => {
            this.columnList = config.displayedColumns;
            if (config?.SelectorSettings) this.SelectorSettings = config.SelectorSettings;
            this.selectedValues = this.columnList.filter(col => col.show).map(col => col.column);
        });
    }

    public catchChanges(): void {
        this.columnList.forEach(col => col.show = this.selectedValues.includes(col.column));
        this.dynamicTableService.updateColumnsShow = this.columnList;
    }

    getHeader = (column: string) => this.columnList.find(col => col.column === column)?.header;
}
