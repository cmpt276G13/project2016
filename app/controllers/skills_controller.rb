class SkillsController < ApplicationController
  attr_accessor :file
  before_action :get_skills_file
  before_action :logged_in_user
  
  def index
    @skills = JSON.parse self.file
  end
  
  def show
    @skill = JSON.parse(self.file)[params[:name]]
  end
  
  private
  
    def get_skills_file
      self.file = File.read("app/assets/skills/skills.json")
    end
end
