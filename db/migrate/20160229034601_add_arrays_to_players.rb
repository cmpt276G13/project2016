class AddArraysToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :ongoing_quests, :text
    add_column :players, :completed_quests, :text
  end
end
