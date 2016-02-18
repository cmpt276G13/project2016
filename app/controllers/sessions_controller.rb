class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(username: params[:session][:username].downcase)
    if user && user.authenticate(params[:session][:password])
      log_in user
      # condition ? if true : if false
      params[:session][:remember_me] == '1' ? remember(user) : forget(user)
      redirect_to user # Could redirect to the hub page instead of the profile
    else
      flash.now[:danger] = 'Invalid username/password combination'
      render 'new'
    end
    
    # http://www.rubydoc.info/gems/geo_ip
    # returns :ip, :country_name, :city, :latitude, :longitude, etc.
    @info = GeoIp.geolocation(request.remote_ip)
    @latitude = @info[:latitude]
    @longitude = @info[:longitude]
  end

  def destroy
    log_out if logged_in?
    redirect_to root_url
  end
end
