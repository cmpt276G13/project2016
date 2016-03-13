class AddTurnedInToQuestAcceptances < ActiveRecord::Migration
  def change
    add_column :quest_acceptances, :turned_in, :boolean
  end
end
