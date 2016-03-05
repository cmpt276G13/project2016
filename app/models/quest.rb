class Quest < ActiveRecord::Base
  serialize [:pre_req, :other_req], Array
end
