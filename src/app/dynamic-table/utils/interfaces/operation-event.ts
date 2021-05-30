export interface OperationEvent {
    type: TypeOpEvent;
    value: number | string | any | null;
}

export enum TypeOpEvent {
    New = 'N', Update = 'M', Delete = 'E'
}
