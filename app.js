(function(){
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective)

    .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'menu.html',
            scope: {
                title:'@',
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'list',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        var list = this;

    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(service) {
        var controller = this;

        controller.searchItem = '';
        controller.items = [];

        controller.findItems = function () {
            service.getMatchedMenuItems(controller.searchItem).then(function (foundItems) {
                controller.items = foundItems;
            });
        }

        controller.removeItem = function (itemIndex) {
            console.log(itemIndex);
            controller.items.splice(itemIndex, 1);
        };

    }


    MenuSearchService.$inject =['$http','ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function (result) {
                var foundItems = [];
                var srcLower = searchTerm.toLowerCase();
                //find items matching
                for (var i = 0; i < result.data.menu_items.length; i++) {
                    var item = result.data.menu_items[i];
                    if (item.name.toLowerCase().indexOf(srcLower) !== -1 || item.description.toLowerCase().indexOf(srcLower) !== -1) {
                        foundItems.push(item);
                    }
                }

                //return processed items
                return foundItems;
            });
        };


    }

})();