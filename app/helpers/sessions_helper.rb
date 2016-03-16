module SessionsHelper
  # Logs in the given user.
  def log_in(user)
    session[:user_id] = user.id
  end
  
  # Remembers a user in a persistent session.
  def remember(user)
    user.remember
    # Cookies that persist for 20 years
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end
  
  # Returns true if the given user is the current user.
  def current_user?(user)
    user == current_user
  end
  
  # Returns the current logged-in user, if any.
  def current_user
    if (user_id = session[:user_id])
      @current_user ||= User.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      user = User.find_by(id: user_id)
      if user && user.authenticated?(cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end
  
  # Returns the current player, if any.
  def current_player
    if current_user
      current_user.player
    end
  end
  
  # Returns true if the user is logged in, false otherwise.
  def logged_in?
    !current_user.nil?
  end
  
  # Forgets a persistent session.
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end
  
  # Logs out the current user.
  def log_out
    forget(current_user)
    session.delete(:user_id)
    @current_user = nil
  end
  
  # Gets all user location info including
  # :ip, :country_name, :city, :latitude, :longitude, etc.
  def get_user_location
    # https://github.com/jeroenj/geo_ip
    # http://www.rubydoc.info/gems/geo_ip
    #return: hash w/ location info
    GeoIp.geolocation(request.remote_ip)
    #@latitude = @user_location[:latitude]
    #@longitude = @user_location[:longitude]
  end
  
  # Initializes various locations on the map
  def init_markers
    @vancouver = {:title => "Vancouver, Canada", :lat => 49.2827, :lng => -123.1207}
    @paris = {:title => "Paris, France", :lat => 48.8567, :lng => 2.3508}
    @tokyo = {:title => "Tokyo, Japan", :lat => 35.6833, :lng => 139.6833}
    @cairo = {:title => "Cairo, Egypt", :lat => 30.0500, :lng => 31.2333}
    @sydney = {:title => "Sydney, Australia", :lat => -33.8650, :lng => 151.2094}
    @brasilia = {:title => "Brasilia, Brazil", :lat => -15.7939, :lng => -47.8828}
  end
  
  # 
  def get_chosen_location
    @chosen_place = Place.new(session[:chosen_attributes])
  end
  
  # Redirects to stored location (or to the default).
  def redirect_back_or(default)
    redirect_to(session[:forwarding_url] || default)
    session.delete(:forwarding_url)
  end

  # Stores the URL trying to be accessed.
  def store_location
    session[:forwarding_url] = request.url if request.get?
  end
  
  # Confirms a logged-in user. For controllers to determine if logged_in
  def logged_in_user
    unless logged_in?
      store_location
      flash[:danger] = "Please log in."
      redirect_to login_url
    end
  end
end
