class ItemsController < ApplicationController
  attr_accessor :file
  before_action :get_items_file
  
  def index
    @items = JSON.parse self.file
  end
  
  def show
    @item = JSON.parse(self.file)[params[:name]]
  end
  
  private
  
    def get_items_file
      self.file = File.read("app/assets/items/items.json")
    end
end
