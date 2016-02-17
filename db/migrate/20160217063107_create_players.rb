class CreatePlayers < ActiveRecord::Migration
  def change
    create_table :players do |t|
      t.string :username
      t.integer :health, default: 50
      t.integer :strength, default: 10
      t.integer :defense, default: 10
      t.integer :level, default: 1
      t.integer :experience, default: 0
      t.integer :gold, default: 0

      t.timestamps null: false
    end
    add_index :players, :username, unique: true
  end
end
