class QuestAcceptance < ActiveRecord::Base
  belongs_to :player
  belongs_to :quest
  validates :quest_id, uniqueness: true
end
