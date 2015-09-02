/**
 * @fileOverview
 *
 * This file contains the helloworld directive and controller
 */


/**
 * Helloworld directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function HelloworldDirective(){
    return {
        scope: {},
        controllerAs: 'vm',
        controller: HelloworldController,
        bindToController: true,
        templateUrl: 'components/helloworld/helloworld.html'
    };
}

/**
 * Helloworld directive controller
 *
 * @constructor
 * @ngInject
 */
function HelloworldController(){

}
