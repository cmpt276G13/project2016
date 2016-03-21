class Place < ActiveRecord::Base
    belongs_to :user
    validates :address, presence: true
    validates :title, presence: true
    validates :user_id, presence: true
    geocoded_by :address
    after_validation :geocode
    
end
