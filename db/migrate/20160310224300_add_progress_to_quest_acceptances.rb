class AddProgressToQuestAcceptances < ActiveRecord::Migration
  def change
    add_column :quest_acceptances, :progress, :text, default: {}
  end
end
