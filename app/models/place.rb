class Place < ActiveRecord::Base
    belongs_to :user
    has_one :user
    geocoded_by :address
    after_validation :geocode
end
