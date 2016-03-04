class Quest < ActiveRecord::Base
  validates :name, presence: true, length: {maximum: 50}
  validates :description, presence: true
  validates :level_req, presence: true
  has_many :quest_acceptances
  has_many :players, through: :quest_acceptances
  serialize [:pre_req, :other_req], Array
end
