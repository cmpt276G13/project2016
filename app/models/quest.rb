class Quest < ActiveRecord::Base
  has_many :quest_acceptances
  has_many :players, through: :quest_acceptances
  serialize [:pre_req, :other_req], Array
end
