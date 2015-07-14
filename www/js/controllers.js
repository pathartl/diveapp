angular.module('dive.controllers', [])

.controller('GlobalCtrl', function($scope, $rootScope, Subsonic) {

    var loadedSettings = JSON.parse(window.localStorage['settings'] || '{}');

    if ( loadedSettings == {} ) {
        // No settings saved
        $rootScope.settings = {
            alphabetSeparators: true
        }
    } else {
        // Load our settings
        $rootScope.settings = loadedSettings;
    }

    var loadedQueue = JSON.parse(window.localStorage['queue'] || '[]')

    if ( loadedQueue == [] ) {
        $rootScope.queue = []
    } else {
        $rootScope.queue = loadedQueue;
    }

    $rootScope.audioPlayer = document.getElementById('audio-player');

    $scope.playSong = function(id) {
        $rootScope.audioPlayer.src = Subsonic.getSongUrl(id);
        $rootScope.audioPlayer.play();
    }

    $scope.queue.play = function() {
        $scope.currentSongInQueue = 0;
        $scope.playSong($rootScope.queue[$scope.currentSongInQueue].id);
        $rootScope.audioPlayer.onended = function() {
            $scope.currentSongInQueue++;
            $scope.playSong($rootScope.queue[$scope.currentSongInQueue].id);
        }
    }

    $scope.queue.clear = function() {
        $rootScope.queue.length = 0;
    }

    $scope.queue.shuffle = function() {
        var currentIndex = $rootScope.queue.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while ( 0 !== currentIndex ) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = $rootScope.queue[currentIndex];
            $rootScope.queue[currentIndex] = $rootScope.queue[randomIndex];
            $rootScope.queue[randomIndex] = temporaryValue;
        }
    }

    $scope.addSongToQueue = function(id) {
        Subsonic.getSong(id).then(function(response) {
            $rootScope.queue.push(response.data['subsonic-response'].song);
            console.log($rootScope.queue);
        });
    }
})

.controller('ArtistsCtrl', function($scope, Subsonic) {
    Subsonic.getArtists().then(function(response) {
        // Set our artists to the indexes so we can structure via template
        $scope.artists = response.data['subsonic-response'].artists.index;
    });
})

.controller('ArtistDetailCtrl', function($scope, $rootScope, $stateParams, Subsonic) {
    console.log($stateParams.artistId);
    Subsonic.getArtistAlbums($stateParams.artistId).then(function(response) {
        $scope.artist = response.data['subsonic-response'].artist;
        console.log(response);

        // // Get real width
        // var coverSize = window.innerWidth * window.devicePixelRatio;

        // $scope.album.artUrl = Subsonic.getAlbumArt($scope.album.id, coverSize);
        // console.log(response);
    });
})

.controller('AlbumsCtrl', function($scope, $rootScope, Subsonic) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    Subsonic.allAlbums($scope).then(function(response) {
        console.log(response);
        $scope.albums = response.data['subsonic-response'].albumList2.album;

        // $scope.albums.forEach(function(album, i) {
        //     album.artUrl = Subsonic.getAlbumArt(album.id, 80);
        // });

        //console.log($scope.albums);
    });
    
    $scope.albums = Subsonic.allAlbums($scope);

})

.controller('AlbumDetailCtrl', function($scope, $rootScope, $stateParams, Subsonic) {
    console.log($stateParams.albumId);
    Subsonic.getAlbum($stateParams.albumId).then(function(response) {
        $scope.album = response.data['subsonic-response'].album;

        //$scope.album.artUrl = Subsonic.getAlbumArt($scope.album.id, window.innerWidth);
        //console.log(response);
    });
})

.controller('QueueCtrl', function($scope, $rootScope, Subsonic) {
    $scope.queue = $rootScope.queue;

    $scope.moveItem = function(item, fromIndex, toIndex) {
        console.log('move');
        console.log(item);
        console.log($scope.queue);
        //Move the item in the array
        $scope.queue.splice(fromIndex, 1);
        $scope.queue.splice(toIndex, 0, item);
    };

    $scope.$watch('queue', function() {
        window.localStorage['queue'] = JSON.stringify($scope.queue);
    }, true)
})

.controller('SettingsCtrl', function($scope, $rootScope, $ionicHistory) {

    $scope.$watch('settings', function() {
        $rootScope.settings = $scope.settings;
        window.localStorage['settings'] = JSON.stringify($scope.settings);
        $ionicHistory.clearCache();
    }, true);


});
