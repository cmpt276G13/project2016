class AddSkillsToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :skills, :text, default: []
    add_column :players, :mana, :integer, default: 25
    add_column :players, :max_mana, :integer, default: 25
    add_column :players, :magic_power, :integer, default: 10
    add_column :players, :magic_defense, :integer, default: 10
  end
end
