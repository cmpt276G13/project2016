class AddItemsToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :items, :text, :default => []
  end
end
