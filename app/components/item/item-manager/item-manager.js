/**
 * @fileOverview
 *
 * This file contains the Item manager module definition
 */

import angular from 'angular';

import Item from '../item-model/item-model.js';
import ItemManager from './item-manager-service.js'

export default angular.module('app.managers.item', [
    Item.name
])

.service('ItemManager', ItemManager);
