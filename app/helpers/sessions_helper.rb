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
    session.delete(:chosen_attributes)
    @current_user = nil
  end
  
  # Upon log-in, session[:chosen_attributes] is set to empty
  # Upon log-out, session[:chosen_attributes] is deleted
  def get_chosen_location
    if session[:chosen_attributes]
      @chosen_place = Place.new(session[:chosen_attributes])
    else
      @chosen_place = GeoIp.geolocation(request.remote_ip)
      if @chosen_place.nil?
        surrey = Geocoder.search("Surrey")[0]
        @chosen_place = Place.new(latitude: surrey.latitude, longitude: surrey.longitude)
      end
    end
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
