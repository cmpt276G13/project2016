class CreatePlayers < ActiveRecord::Migration
  def change
    create_table :players do |t|
      t.string :username
      t.integer :health
      t.integer :strength
      t.integer :defense
      t.integer :level
      t.integer :experience

      t.timestamps null: false
    end
    add_index :players, :username, unique: true
  end
end
