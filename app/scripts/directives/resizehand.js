'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:resizeHand
 * @description
 * # resizeHand
 */
angular.module('grafterizerApp')
  .directive('resizeHand', function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var margin = attrs.margin ? parseInt(attrs.margin) : 300;

        var target = document.getElementById(attrs.
          for);
        if (!target) return;

        var savedW = 0;
        var updateLayout = function(w)  {
          var parent = element.parent();
          var containerWidth = parent.length > 0 ? parent[0].clientWidth : window.innerWidth;

          if (containerWidth < 600) {
            element.css('display', 'none');
            target.setAttribute('flex', '');
            target.style.width = '';
            angular.element(target).addClass('flex');
            scope.$emit('resize-hand', {
              left: containerWidth,
              right: containerWidth
            });
            return;
          }

          element.css('display', 'block');
          target.removeAttribute('flex');
          angular.element(target).removeClass('flex');

          w = Math.min(Math.max(Math.round(w), margin), containerWidth - margin);
          element.css('left', (w - 3) + 'px');
          element.css('height', target.clientHeight + 'px');
          target.style.width = w + 'px';
          savedW = w;

          scope.$emit('resize-hand', {
            left: w,
            right: containerWidth - w
          });

          if (window.sessionStorage) {
            window.sessionStorage.setItem('resizeHand' + attrs.for, w);
          }
        };

        var mousemove;

        if (window.requestAnimationFrame) {
          var requestAnim = 0;
          mousemove = function(e) {
            if (!requestAnim) {
              requestAnim = window.requestAnimationFrame(function() {
                updateLayout(e.offsetX);
                requestAnim = 0;
              });
            }
          };
        } else {
          mousemove = _.throttle(function(e) {
            updateLayout(e.offsetX);
          }, 1 / 2000);
        }

        window.addEventListener('resize', function() {
          mousemove({
            offsetX: savedW
          });
        });

        var initLayout = function() {
          var key = 'resizeHand' + attrs.for;
          var width = window.sessionStorage && window.sessionStorage.hasOwnProperty(key) ?
            parseInt(window.sessionStorage.getItem(key)) : window.innerWidth / 2;
           
          updateLayout(width);
        };

        initLayout();
        window.setTimeout(initLayout, 1000);

        var mask = document.createElement('div');
        mask.className = 'resize-hand-mask';

        var isDragging = false;
        element.on('mousedown', function(ev) {
          isDragging = true;
          element.parent().append(mask);
          mask.addEventListener('mousemove', mousemove);
        });

        element.on('dragstart', function(ev) {
          ev.preventDefault();
        });

        var stopDrag = function() {
          if (isDragging) {
            mask.removeEventListener('mousemove', mousemove);
            element[0].parentNode.removeChild(mask);
            isDragging = false;
          }
        };

        mask.addEventListener('mouseup', stopDrag);
        mask.addEventListener('mouseleave', stopDrag);

        scope.$on('$destroy', function() {
          target.setAttribute('flex', '');
          target.style.width = '';
          angular.element(target).addClass('flex');
        });
      }
    };
  })
  .directive('resizeHandTabsFix', function($rootScope) {
    return {
      restrict: 'A',
      require: 'mdTabs',
      link: function postLink(scope, element, attrs, mdTabsCtrl) {
        var side = attrs.resizeHandTabsFix || 'left';
        var previousMaxWidth = 0;
        $rootScope.$on('resize-hand', function(event, args) {
          var newWidth = args[side];
          if (Math.abs(previousMaxWidth - newWidth) > 10) {
            mdTabsCtrl.maxTabWidth = newWidth;
            previousMaxWidth = newWidth;
          }
        });
      }
    };
  });

