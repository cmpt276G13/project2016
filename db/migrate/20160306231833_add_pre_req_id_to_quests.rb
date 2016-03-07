class AddPreReqIdToQuests < ActiveRecord::Migration
  def change
    add_column :quests, :integer, :pre_req_id, index: true, foreign_key: true
  end
end
