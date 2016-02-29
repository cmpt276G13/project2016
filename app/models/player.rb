class Player < ActiveRecord::Base
  belongs_to :user
  validates :user_id, presence: true
  # Use eg. @player.items = ['item', 'x']. Don't forget to use @player.save
  serialize [:items, :ongoing_quests, :completed_quests]
end
