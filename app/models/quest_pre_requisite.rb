class QuestPreRequisite < ActiveRecord::Base
  belongs_to :quest_parent, class_name: :Quest
  belongs_to :quest_child, class_name: :Quest
end
