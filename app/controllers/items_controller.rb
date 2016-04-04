class ItemsController < ApplicationController
  attr_accessor :file
  before_action :get_items_file
  before_action :logged_in_user
  
  def index
    all_items = JSON.parse self.file
    @items = Hash.new
    all_items.each do |key, value|
      if value["price"]
        @items[key] = value
      end
    end
    @player = current_user.player
  end
  
  def show
    @item = JSON.parse(self.file)[params[:name]]
    @player = current_user.player
    
    # Allow the back button to redirect back after buying items.
    if request.env["HTTP_REFERER"] == item_url(params[:name])
      request.env["HTTP_REFERER"] = (session[:forwarding_url] || items_url)
      session.delete(:forwarding_url)
    else
      session[:forwarding_url] = request.env["HTTP_REFERER"]
    end
  end
  
  private
  
    def get_items_file
      self.file = File.read("app/assets/items/items.json")
    end
end
