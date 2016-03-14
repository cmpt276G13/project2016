class Player < ActiveRecord::Base
  
  belongs_to :user
  has_many :quest_acceptances
  has_many :quests, through: :quest_acceptances
  
  validates :user_id, presence: true
  validates :experience, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :gold, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :strength, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :defense, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :health, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :max_health, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :deaths, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :level, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :experience_to_next_level, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  # Use eg. @player.items << 'name': amount
  # Don't forget to use @player.save
  serialize :items, Hash
  
  # Run this method to update the items. You can add additional options for gold.
  # If gold is not put in, it will update items without the need for price.
  # params should be like this {item_name:amount, item_name:amount,...}
  def update_items!(params, options = {})
    price = options[:price].to_i || nil
    
    params.each do |key, value|
      if price # Update gold, if necessary
        if self.gold >= price * value.to_i
          self.gold = self.gold - price * value.to_i
        else
          return false
        end
      end
      
      if self.items[key]
        self.items[key] = self.items[key].to_i + value.to_i
      else
        self.items[key] = value
      end
    end
    
    self.save
  end
  
  # Handles level ups.
  def level_up
    while self.experience >= self.experience_to_next_level
      self.level += 1
      
      self.max_health += 20
      self.health = self.max_health
      self.strength += 5
      self.defense += 5
      self.experience -= self.experience_to_next_level
      self.experience_to_next_level += 5 * self.level
    end
    
    self.save
  end
  
  # Turns in the quest given the quest_id
  def turn_in(quest_id)
    self.quest_acceptances.find_by(quest_id: quest_id).update(turned_in: true)
  end
  
  # Returns true if the player can accept the quest.
  def can_accept?(quest)
    quest_req_met?(quest) && !accepted?(quest) && level_met?(quest)
  end
  
  # Returns the quest_acceptance record, if any. Returns Nil, otherwise.
  def accepted?(quest)
    self.quest_acceptances.find_by(quest_id: quest[:id])
  end
  
  # Returns true if the level requirement is met.
  def level_met?(quest)
    self.level >= quest.level_req
  end
  
  # Returns true if the quest requirements are met.
  def quest_req_met?(quest)
    if !quest.quests.empty?
      self.quest_acceptances.where(turned_in: true).
              exists?(quest_id: quest.quest_pre_requisites.pluck(:quest_child_id))
    else
      true
    end
  end
  
  def completed?(quest)
    accepted?(quest).completed? if accepted?(quest)
  end
  
  def turned_in?(quest)
    accepted?(quest).turned_in? if accepted?(quest)
  end
  
  def init_progress(quest)
    q_acceptance = accepted?(quest)
    quest.target.each_key do |target|
      q_acceptance.progress[target] = 0
    end
    q_acceptance.save
  end
end
