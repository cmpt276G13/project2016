class Player < ActiveRecord::Base
  belongs_to :user
  validates :user_id, presence: true
  # Use eg. @player.items = ['name', 'id']
  # Or append the array @player.ongoing_quests << 2. Don't forget to use @player.save
  serialize [:items, :ongoing_quests, :completed_quests], Array
end
