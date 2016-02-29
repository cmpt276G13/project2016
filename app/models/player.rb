class Player < ActiveRecord::Base
  belongs_to :user
  validates :user_id, presence: true
  serialize :items # Use eg. @player.items = ['item', 'x']. Don't forget to use @player.save
end
