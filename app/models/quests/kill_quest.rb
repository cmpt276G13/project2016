class KillQuest < Quest
  validates :target, presence: true
  validates :rewards, presence: true
  
  # This is required to get all of the quests with one statement
  def self.model_name
    Quest.model_name
  end
  
  def after_turned_in(player)
  end
end