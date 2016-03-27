class AddItemsToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :items, :text, :default => { "Small Potion" => 2, "Medium Potion" => 2 }
  end
end
