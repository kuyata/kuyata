/**
 * @fileOverview
 *
 * This file contains the utils service. Utility functions container
 */

import _ from 'lodash';

/**
 * Utility functions container service
 *
 */
export default class Utils {

    /**
     *
     * @ngInject
     */
    constructor(){
    }

    /**
     * Utility method to avoid boilerplate code on models definitions, following our convention of create angular-data
     * resources from classes.
     * See: http://angular-data.pseudobry.com/documentation/api/angular-data/DS.sync%20methods_defineResource
     *
     * @param DS angular-data public data store interface
     * @param resourceClass the class from where we pickup class and instance methods
     * @param resourceDefinition definition param of DS.defineResource() methods
     * @returns {*}
     */
    defineAngularDataResource(DS, resourceClass, resourceDefinition){
        resourceDefinition.defaultAdapter = resourceDefinition.defaultAdapter || 'sql'; // Default adapter
        resourceDefinition.methods = {}; // The instance methods goes here

        _.assign(resourceDefinition.methods, resourceClass.prototype);  // Pick instance methods from prototype
        var Resource = DS.defineResource(resourceDefinition); // Define the resource
        _.assign(Resource, resourceClass); // Pick class methods from class object and add them to the resource 'class'

        return Resource;
    }

}