import angular from 'angular';
import 'angular-ui-router';
import "file-loader?name=lib/jschannel.js!./lib/jschannel.js";

import routesConfig from './routes';

import {previewModule} from './app/preview/index';

import {main} from './app/main';

import './index.less';

angular
  .module('app', ['ui.router', previewModule])
  .config(routesConfig)
  .component('app', main);
