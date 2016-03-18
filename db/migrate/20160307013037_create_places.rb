class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.float :latitude
      t.float :longitude
      t.string :address
      t.string :title
      
      t.integer :user_id # added 3/18
      t.timestamps null: false
    end
  end
end
