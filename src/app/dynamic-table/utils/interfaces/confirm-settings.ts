import {ThemePalette} from '@angular/material/core/common-behaviors/color';

export interface ConfirmSettings {
    title: string,
    content: string,
    Accept: {
        color: ThemePalette,
        literal: string
    },
    Cancel: {
        color: ThemePalette,
        literal: string
    }
}
