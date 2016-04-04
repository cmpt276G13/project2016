class Quest < ActiveRecord::Base
  validates :name, presence: true, length: {maximum: 50}
  validates :description, presence: true
  validates :level_req, presence: true
  # Make associations to itself for pre-requisites
  has_many(:quest_pre_requisites, foreign_key: :quest_parent_id, dependent: :destroy)
  # Added in order to destroy data if a quest is deleted.
  has_many(:reverse_quest_pre_requisites, class_name: :QuestPreRequisite, 
      foreign_key: :quest_child_id, dependent: :destroy)
  has_many :quests, through: :quest_pre_requisites, source: :quest_child
  has_many :quest_acceptances, dependent: :destroy
  has_many :players, through: :quest_acceptances
  serialize :rewards, Hash
  serialize :other_req, Hash
  serialize :target, Hash
end
