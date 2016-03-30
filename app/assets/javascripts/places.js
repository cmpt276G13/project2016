var handler = Gmaps.build('Google');
handler.buildMap({ internal: {id: 'geolocation'} }, function(){
  handler.map.centerOn([49.19426915204543, -122.7577972412109416778]);
  handler.getMap().setZoom(10);

  var user_markers_json = <%=raw @user_markers.to_json %> ;
  var u_markers = handler.addMarkers(user_markers_json);
  for (var i = 0; i <  user_markers_json.length; ++i) {
    //console.log(u_markers) ;
    google.maps.event.addListener(u_markers[i], 'rightclick', function(){
      alert("click") ;
    });
  }
  place_marker();
});

function place_marker() {
  google.maps.event.addListener(handler.getMap(), 'rightclick', function(e) {
    if (window.confirm('Place marker here?')) {
      var image = 'https://cdn3.iconfinder.com/data/icons/location-vol-2/128/location-15-32.png' ;
      var click_marker = new google.maps.Marker({
        position: e.latLng, 
        map: handler.getMap(),
        icon: image
      });
      
      // https://www.codementor.io/ruby-on-rails/tutorial/tutorial-how-to-debug-ajax-in-rails
      // To pass to controller:
      var place = { 
        place: {
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng(),
          title: "clicked" 
        }
      } 
      
      // Post data via ajax to a rails controller
      //$.post('/places', place);
      $.ajax({
        type: "POST",
        url: '/places',
        data: place
      });
      location.reload();
    }
  });
}