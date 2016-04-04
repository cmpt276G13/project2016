module SkillsHelper
  # Returns an array of the skills that the player does not currently have.
  def available_skills(skills)
    skills.slice!(*(current_player.skills + current_player.BASIC_SKILLS))
  end
end
