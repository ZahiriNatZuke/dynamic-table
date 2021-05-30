export interface Column {
    header: string;
    column: string;
    show: boolean;
    type: ColumnType;
    prop?: string;
}

export enum ColumnType {
    Regular = 1, Concat = 2, Bullets = 3, Boolean = 4, Date = 5
}
