angular.module('dive.filters', [])

.filter('getCoverArt', function(Subsonic) {
    return function(id, size) {
    	if ( size == 'full' ) {
    		size = window.innerWidth;
    	}

    	return Subsonic.requestUrl('getCoverArt', { id: id, size: size * window.devicePixelRatio});

    }
});