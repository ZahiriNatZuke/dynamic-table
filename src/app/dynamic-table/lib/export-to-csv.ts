import {ngxCsv} from 'ngx-csv';

export class UtilCSV {
    public exportDataCSV(dataToExport: any[], nameFileToExport: string, options: any = null) {
        new ngxCsv(dataToExport, nameFileToExport, options);
    }
}
