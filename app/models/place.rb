class Place < ActiveRecord::Base
    belongs_to :user
    #validates :address, presence: true
    validates :title, presence: true
    validates :user_id, presence: true
    #validates_numericality_of :latitude, :greater_than_or_equal_to => 49.0587, :less_than_or_equal_to => 49.2880
    #validates_numericality_of :longitude, :greater_than_or_equal_to => -123.053130, :less_than_or_equal_to => -122.710553
    #geocoded_by :address
    #after_validation :geocode
    
    reverse_geocoded_by :latitude, :longitude
    after_validation :reverse_geocode  # auto-fetch address
    
end
