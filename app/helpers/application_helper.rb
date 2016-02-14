module ApplicationHelper
  
  # Returns the full title if there is not one specified
  def full_title(page_title = '')
    base_title = "GeoHunter"
    if page_title.empty?
      base_title
    else
      page_title + " | " + base_title
    end
  end
end
