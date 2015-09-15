/**
 * @fileOverview
 *
 * This file contains the Category manager module definition
 */

import angular from 'angular';

import Category from '../category-model/category-model.js';
import CategoryManager from './category-manager-service.js'

module.exports = angular.module('app.managers.category', [
    Category.name
])

.service('CategoryManager', CategoryManager);
