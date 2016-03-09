class Player < ActiveRecord::Base
  belongs_to :user
  has_many :quest_acceptances
  has_many :quests, through: :quest_acceptances
  validates :user_id, presence: true
  # Use eg. @player.items << 'name': amount
  # Don't forget to use @player.save
  serialize :items, Hash
  
  def update_items!(params, options = {})
    # Update gold, if necessary
    gold = options[:gold] || nil
    if gold
      if self.gold >= gold
        self.update_attributes(gold: (self.gold - gold))
      else
        return false
      end
    end
    
    params.each do |key, value|
      if self.items[key]
        self.items[key] = self.items[key].to_i + value.to_i
      else
        self.items[key] = value
      end
    end
    
    self.save
  end
  
  # Returns true if the player can accept the quest.
  def can_accept?(quest)
    self.quest_req_met?(quest) && !self.accepted?(quest)
  end
  
  # Returns true if the quest is already accepted.
  def accepted?(quest)
    self.quest_acceptances.find_by(quest_id: quest[:id])
  end
  
  # Returns true if the quest requirements are met.
  def quest_req_met?(quest)
    self.quest_acceptances.where(completed: true).
              exists?(quest_id: quest.quest_pre_requisites.pluck(:quest_child_id))
  end
end
