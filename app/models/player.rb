class Player < ActiveRecord::Base
  belongs_to :user
  has_many :quest_acceptances
  has_many :quests, through: :quest_acceptances
  validates :user_id, presence: true
  # Use eg. @player.items << 'name'
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
  
  # Checks if the requirements are met and prevents duplicates
  def can_accept?(quest)
    # req_met = self.quest_acceptances
    not_duplicate = !self.quest_acceptances.find_by(quest_id: quest[:id])
    
    # req_met && not_duplicate
  end
end
