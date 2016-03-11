class QuestAcceptance < ActiveRecord::Base
  belongs_to :player
  belongs_to :quest
  # progress hash should have the name and the amount killed/gathered/etc.
  # Ex. { orc: 2, some_monster: 1 }
  serialize :progress, Hash
  after_initialize :init
  
  def init
    self.completed ||= false
    self.turned_in ||= false
  end
end
