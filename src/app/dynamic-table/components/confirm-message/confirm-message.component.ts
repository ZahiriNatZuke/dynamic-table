import {Component, OnInit} from '@angular/core';
import {DynamicTableService} from '../../dynamic-table.service';
import {ConfirmSettings} from '../../utils/interfaces/confirm-settings';

@Component({
    templateUrl: './confirm-message.component.html',
    styleUrls: ['./confirm-message.component.scss']
})
export class ConfirmMessageComponent implements OnInit {
    public ConfirmSettings: ConfirmSettings = {
        title: 'Elimination Control',
        content: `<p>Are you sure do you want to <b>eliminate</b> this item?</p>`,
        Accept: {
            color: 'primary',
            literal: 'Accept'
        },
        Cancel: {
            color: 'warn',
            literal: 'Cancel'
        }
    };

    constructor(private dynamicTableService: DynamicTableService) {
    }

    ngOnInit(): void {
        this.dynamicTableService.configTableObservable.subscribe(config => {
            if (!!config?.ConfirmSettings) this.ConfirmSettings = config.ConfirmSettings;
        });
    }

}
