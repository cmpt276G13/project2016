class QuestAcceptance < ActiveRecord::Base
  belongs_to :player
  belongs_to :quest
  
  after_update :after_turned_in
  # progress hash should have the name and the amount killed/gathered/etc.
  # Ex. { orc: 2, some_monster: 1 }
  serialize :progress, Hash
  after_initialize :init
  
  def after_turned_in
    self.quest.after_turned_in(self.player) if self.turned_in_changed? && self.turned_in == true
  end
  
  private
    
    def init
      self.completed ||= false
      self.turned_in ||= false
    end
end
