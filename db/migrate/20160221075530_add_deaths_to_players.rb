class AddDeathsToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :deaths, :integer, default: 0
  end
end
