class KillQuest < Quest
  validates :target, presence: true
  validates :rewards, presence: true
  
  def self.model_name
    Quest.model_name
  end
  
  def after_turned_in(player)
  end
end