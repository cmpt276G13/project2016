class CreateQuestPreRequisites < ActiveRecord::Migration
  def change
    create_table :quest_pre_requisites, force: true do |t|
      t.integer :quest_parent_id, null: false
      t.integer :quest_child_id, null: false

      t.timestamps null: false
    end
  end
end
