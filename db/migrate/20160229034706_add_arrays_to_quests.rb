class AddArraysToQuests < ActiveRecord::Migration
  def change
    add_column :quests, :pre_req, :text
    add_column :quests, :other_req, :text
  end
end
