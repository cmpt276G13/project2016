class CreateQuestAcceptances < ActiveRecord::Migration
  def change
    create_table :quest_acceptances do |t|
      t.belongs_to :player, index: true, foreign_key: true
      t.belongs_to :quest, index: true, foreign_key: true
      t.boolean :completed, default: false

      t.timestamps null: false
    end
    add_index :quest_acceptances, [:quest_id, :completed], unique: true
  end
end
