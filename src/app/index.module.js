import { config } from './index.config';
import { routerConfig } from './index.route';
import { MainController } from './main/main.controller';

angular.module('rigiViewerWeb', ['ui.router'])
  .config(config)
  .config(routerConfig)
  .controller('MainController', MainController);
