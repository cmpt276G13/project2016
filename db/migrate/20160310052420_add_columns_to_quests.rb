class AddColumnsToQuests < ActiveRecord::Migration
  def change
    add_column :quests, :rewards, :text, default: { }.to_yaml
    add_column :quests, :type, :string
    add_column :quests, :target, :text, default: { }.to_yaml
    add_index :quests, :name, unique: true
  end
end
