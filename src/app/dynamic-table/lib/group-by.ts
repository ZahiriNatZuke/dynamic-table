import {NgModule, Injectable} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {GroupingColumn} from '../utils/interfaces/grouping-column';
import {NestedPropertyPipe} from '../utils/pipes/nested-property.pipe';

@Injectable({providedIn: 'root'})
@NgModule({imports: [CommonModule]})
export class MatGroupBy {

    public groupingChange: BehaviorSubject<Grouping>;

    constructor() {
        this.groupingChange = new BehaviorSubject<Grouping>(this.grouping);
    }

    // @ts-ignore
    public get grouping(): Grouping {
        return <Grouping> this._grouping;
    }

    // @ts-ignore
    public set grouping(grouping: Grouping) {
        this._grouping = grouping;
        this.groupingChange.next(this.grouping);
    }

    private _grouping: Grouping | undefined;
    private groupCache = new GroupCache<Group>();

    public isGroup(index: any, item: { level: boolean; }): boolean {
        return item.level;
    }

    public toggleExpanded(row: { expanded: boolean; }) {
        row.expanded = !row.expanded;
        this.groupingChange.next(this.grouping);
    }

    public groupData<T>(data: T[]): (T | Group)[] {
        let rootGroup = this.getRootGroup();
        if (!rootGroup) {
            rootGroup = new Group();
            this.groupCache.add({}, rootGroup);
        }
        const sortedData = this.grouping.doSort<T>(data);
        return this.getSubLevel<T>(sortedData, 0, rootGroup);
    }

    private getSubLevel<T>(data: T[], level: number, parent: Group): (T | Group)[] {
        // Recursive function, stop when there are no more levels.
        if (level >= this.grouping.columns.length) {
            return data;
        }

        const currentColumn = this.grouping.columns[level].column;
        const currentLabel = this.grouping.columns[level].label;

        const groups = this.uniqueBy(data.map((row: any) => {
            const key: any = {};
            for (let i = 0; i <= level; i++) {
                key[this.grouping.columns[i].column] = new NestedPropertyPipe().transform(row, this.grouping.columns[i].column);
            }

            let result = this.groupCache.retrieve(key);
            const value = result?.value;

            if (value === undefined) {
                result = new Group();
                result.level = level + 1;
                result.parent = parent;
                result.name = currentColumn;
                result.value = new NestedPropertyPipe().transform(row, currentColumn);
                result.key = key;
                result.label = new NestedPropertyPipe().transform(row, currentLabel);
                this.groupCache.add(key, result);
            }
            return result;
        }), JSON.stringify);

        let subGroups: any[] = [];
        groups.forEach((group: Group) => {
            const rowsInGroup = data.filter((row: any) => group.value === new NestedPropertyPipe().transform(row, currentColumn));
            subGroups = subGroups.concat([group]);
            if (group.expanded) {
                subGroups = subGroups.concat(this.getSubLevel<T>(rowsInGroup, level + 1, group));
            }
        });
        return subGroups;
    }

    private uniqueBy(a: any[], key: {
        (
            value: any,
            replacer?: ((this: any, key: string, value: any) => any) | undefined,
            space?: string | number | undefined,
        ): string; (
            value: any,
            replacer?: (string | number)[] | null | undefined,
            space?: string | number | undefined,
        ): string; (arg0: any): any;
    }) {
        const seen: any = {};
        return a.filter(function(item) {
            const k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
    }

    private getRootGroup(): (Group | null) {
        return this.groupCache.retrieve({});
    }
}

export class GroupCache<T> {

    private cache: any = {};

    add(key: any, item: T) {
        const keyString = JSON.stringify(key);
        this.cache[keyString] = item;
    }

    retrieve(key: any): T {
        const keyString = JSON.stringify(key);
        return <T> this.cache[keyString];
    }
}

export class Grouping {
    readonly columns: GroupingColumn[];

    constructor(columns: GroupingColumn[]) {
        this.columns = columns;
    }

    doSort<T>(data: T[]) {
        return data.sort(this.compareGroupedColumns.bind(this));
    }

    compareGroupedColumns<T>(a: any, b: any): number {
        for (let columnIndex = 0; columnIndex < this.columns.length; columnIndex++) {
            // Don't use columns.foreach(column => {...});
            // it prevents the return value being passed out of the function.
            const column = this.columns[columnIndex];
            if (a[column.column] > b[column.column]) {
                return +1;
            }
            if (a[column.column] < b[column.column]) {
                return -1;
            }
        }
        return 0;
    }
}

export class Group {
    level = 0;
    name: string | undefined;
    value: any;
    parent: Group | undefined;
    expanded = true;
    key: object | undefined;
    label: string | undefined;
}
