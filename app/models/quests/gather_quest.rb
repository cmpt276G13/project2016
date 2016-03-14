class GatherQuest < Quest
  validates :target, presence: true
  validates :rewards, presence: true
  
  def self.model_name
    Quest.model_name
  end
  
  def after_turned_in(player)
    # Take away target items.
    self.target.each do |key, value|
      player.items[key] = player.items[key].to_i - value.to_i
    end
    
    player.save
  end
end