class Player < ActiveRecord::Base
  belongs_to :user
  has_many :quest_acceptances
  has_many :quests, through: :quest_acceptances
  validates :user_id, presence: true
  # Use eg. @player.items = ['name', 'id']
  # Or append the array 
  #   @player.ongoing_quests << 2
  # Don't forget to use @player.save
  serialize :items
  serialize :completed_quests, Array
end
