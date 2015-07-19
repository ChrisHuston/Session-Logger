'use strict';

angular.module('sessionLoggerApp')
  .directive('fallbackSrc', function () {
        return {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.on('error',function() {
                    console.log("img error");
                    angular.element(this).attr("src", "http://digital.tuck.dartmouth.edu/sessions/images/Tuck_Logo.png");
                });
            }
        };
  });
