class CreateQuests < ActiveRecord::Migration
  def change
    create_table :quests do |t|
      t.string :name
      t.text :description
      t.integer :level_req

      t.timestamps null: false
    end
  end
end
