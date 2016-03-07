json.array!(@places) do |place|
  json.extract! place, :id, :latitude, :longitude, :address, :title
  json.url place_url(place, format: :json)
end
