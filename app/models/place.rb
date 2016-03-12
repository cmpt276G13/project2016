class Place < ActiveRecord::Base
    belongs_to :player
    geocoded_by :address
    after_validation :geocode
end
