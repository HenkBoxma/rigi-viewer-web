import angular from 'angular';

import {wrapper} from './wrapper';

export const previewModule = 'preview';

angular
.module(previewModule, [])
.component('previewWrapper', wrapper);
