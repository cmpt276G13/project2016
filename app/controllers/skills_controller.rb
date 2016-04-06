class SkillsController < ApplicationController
  attr_accessor :file
  before_action :get_skills_file
  before_action :logged_in_user
  
  def index
    all_skills = JSON.parse self.file
    @skills = Hash.new
    all_skills.each do |key, value|
      if value["price"] && current_player.skills.exclude?(key)
        @skills[key] = value
      end
    end
  end
  
  def show
    @skill = JSON.parse(self.file)[params[:name]]
    
    # Allow the back button to redirect back after buying skills.
    if request.env["HTTP_REFERER"] == skill_url(params[:name])
      request.env["HTTP_REFERER"] = (session[:forwarding_url] || skills_url)
      session.delete(:forwarding_url)
    else
      session[:forwarding_url] = request.env["HTTP_REFERER"]
    end
  end
  
  private
  
    def get_skills_file
      self.file = File.read("app/assets/skills/skills.json")
    end
end
