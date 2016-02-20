class AddMaxHealthAndNextLevelToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :max_health, :integer, default: 50
    add_column :players, :experience_to_next_level, :integer, default: 10
  end
end
