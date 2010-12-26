/**
 * A jQuery plugin for dynamically filtering DOM elements against their text/values
 */
;(function($){
    $.fn.instantFilter = function(options) {
        if (!options) {
            return true;
        }
        var opts = $.extend(true, {}, $.fn.instantFilter.defaults, options);
        function test(condition, needle, haystack, caseSensitive) {
            if (!caseSensitive) {
                needle = needle.toLowerCase();
                haystack = haystack.toLowerCase();
            }
            if (condition == "contains") {
                return haystack.indexOf(needle) !== -1;
            }
            if (condition == "startsWith") {
                return haystack.substring(0, needle.length) === needle;
            }
            if (/RegExp/.test(Object.prototype.toString.call(condition))) {
                return condition.test(haystack);
            }
        }
        return this.each(function() {
            var $this = $(this);
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
            $this.bind('keyup.instantFilter',
                function () {
                    var val = $this.val();
                    $(o.searchElems).each(function(){
                        var $that = $(this);
                        var actEl = o.actElems.call($this, $that);
                		if (test(o.condition, val, $that.text(), o.caseSensitive)) {
                			actEl.show();
                		} else {
                			actEl.hide();
                		}
                	}); 
                });
        });
    };
    $.fn.instantFilter.defaults = {
        condition     : "contains",     // "contains" | "startsWith" | reg exp obj, e.g. /etc/
        searchElems   : "",             // selector string or element collection
        actElems      : function (el){ return el; },    // a function to find which element to act upon based on the currently searched element
        caseSensitive : false
    };
})(jQuery);