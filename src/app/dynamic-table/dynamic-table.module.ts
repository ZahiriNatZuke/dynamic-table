import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {ObserversModule} from '@angular/cdk/observers';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRippleModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';

import {MatGroupBy} from './lib/group-by';
import {DynamicTableComponent} from './dynamic-table.component';
import {ColumnSelectorComponent} from './components/column-selector/column-selector.component';
import {FilterDatabaseComponent} from './components/filter-database/filter-database.component';
import {ConfirmMessageComponent} from './components/confirm-message/confirm-message.component';
import {NestedPropertyPipe} from './utils/pipes/nested-property.pipe';

@NgModule({
    declarations: [
        DynamicTableComponent,
        ColumnSelectorComponent,
        FilterDatabaseComponent,
        ConfirmMessageComponent,
        NestedPropertyPipe
    ],
    imports: [
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatGroupBy,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatMenuModule,
        MatSelectModule,
        ObserversModule,
        FormsModule,
        MatCheckboxModule,
        MatRippleModule,
        MatInputModule,
        MatDialogModule,
        MatDividerModule
    ], exports: [
        DynamicTableComponent,
        ColumnSelectorComponent,
        FilterDatabaseComponent,
        ConfirmMessageComponent
    ]
})
export class DynamicTableModule {
}
