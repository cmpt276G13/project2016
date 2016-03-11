class QuestAcceptance < ActiveRecord::Base
  belongs_to :player
  belongs_to :quest
  after_initialize :init
  
  def init
    self.completed ||= false
    self.turned_in ||= false
  end
end
