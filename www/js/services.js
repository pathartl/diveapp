angular.module('dive.services', [])

.factory('Subsonic', function($http, $rootScope) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = new Array();

  function SubsonicUrl(settings, method, filters) {

    var GETComponents = {
      u: settings.username,
      p: settings.password,
      f: 'jsonp',
      v: '1.6.0',
      c: 'Dive',
      filters: filters,
      callback: 'JSON_CALLBACK'
    }

    var apiUrl = settings.server + '/rest/' + method + '.view';


    var keys = Object.keys(GETComponents);

    // Build URL by going through the URL object
    keys.forEach(function(key, i) {

      if (GETComponents[key] !== null && GETComponents[key] !== undefined) {

        if (key == 'filters') {
          var filterKeys = Object.keys(GETComponents[key]); // Not the dumb Windows kind
          // Loop through our filters
          filterKeys.forEach(function(filterKey, j) {
            apiUrl += '&';
            apiUrl += filterKeys[j] + '=' + GETComponents[key][filterKey];
            //console.log(filterKeys);
            //console.log(GETComponents[key]);
          });

        } else {

          if (i == 0) {
            apiUrl += '?';
          } else {
            apiUrl += '&';
          }

          apiUrl += keys[i] + '=' + GETComponents[key];
        }

      }

    });

    //console.log(apiUrl);

    return apiUrl;
  }

  function SubsonicRequest(settings, method, filters) {

    var promise = $http.jsonp(SubsonicUrl(settings, method, filters))
    .success(function(data){
        //console.log(data);
        return data;
    });

    return promise;
    //console.log(url);
  }

  return {
    requestUrl: function(method, filters) {
      return SubsonicUrl($rootScope.settings, method, filters);
    },
    allAlbums: function(scope) {
      //debugger;
      return SubsonicRequest($rootScope.settings, 'getAlbumList2', { type: 'alphabeticalByArtist', size: '-1'});
    },
    getAlbum: function(id) {
      return SubsonicRequest($rootScope.settings, 'getAlbum', { id: id });
    },
    getAlbumArt: function(id, size) {
      return SubsonicUrl($rootScope.settings, 'getCoverArt', { id: id, size: size * window.devicePixelRatio });
    },
    getArtists: function() {
      return SubsonicRequest($rootScope.settings, 'getArtists', {});
    },
    getArtistAlbums: function(id) {
      //debugger;
      console.log(SubsonicUrl($rootScope.settings, 'getArtist', { id: id }));
      return SubsonicRequest($rootScope.settings, 'getArtist', { id: id });
    },
    getSongUrl: function(id) {
      return SubsonicUrl($rootScope.settings, 'stream', { id: id });
      //$rootScope.audioPlayer
    },
    getSong: function(id) {
      return SubsonicRequest($rootScope.settings, 'getSong', { id: id });
    },
    test: function() {
      console.log('hi');
    },
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
