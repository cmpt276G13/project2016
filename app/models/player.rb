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
  
  # Checks if the requirements are met and prevents duplicates
  def can_accept?(quest)
    # req_met = self.quest_acceptances
    not_duplicate = !self.quest_acceptances.find_by(quest_id: quest[:id])
    
    # req_met && not_duplicate
  end
end
