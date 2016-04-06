class PlacesController < ApplicationController
  # logged_in_user is defined in sessions_helper.rb
  before_action :logged_in_user, only: [:show, :edit, :update, :destroy]
  before_action :req_check, only: :accept
  before_action :set_place, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  # GET /places
  # GET /places.json
  def index
    @places = Place.where(:user_id => session[:user_id])
    @user_markers = Gmaps4rails.build_markers(@places) do |place, marker|
      marker.lat place.latitude
      marker.lng place.longitude
      marker.infowindow place.address
      marker.picture({
        "url" => "https://cdn3.iconfinder.com/data/icons/location-vol-2/128/location-15-32.png",
        "width" => 32,
        "height" => 32})
    end
  end

  # GET /places/1
  # GET /places/1.json
  def show
  end

  # GET /places/new
  def new
    #@place = Place.new
    redirect_to '/places'
  end

  # GET /places/1/edit
  def edit
  end

  # POST /places
  # POST /places.json
  def create
    @place = Place.new(place_params)
    @place.user_id = session[:user_id]
    respond_to do |format|
      if @place.save
          format.html { redirect_to @place, notice: 'Place was successfully created.' }
          format.js 
          format.json {render :index }
      else
        format.html { render :new }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /places/1
  # PATCH/PUT /places/1.json
  def update
    redirect_to '/places'
=begin
    respond_to do |format|
      if @place.update(place_params)
          format.html { redirect_to @place, notice: 'Place was successfully updated.' }
          format.json { render :show, status: :ok, location: @place }
      else
        format.html { render :edit }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
=end
  end

  # DELETE /places/1
  # DELETE /places/1.json
  def destroy
    @place.destroy
    respond_to do |format|
      format.html { redirect_to places_url, notice: 'Place was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def remove_all
    Place.delete_all
    flash[:notice] = "You have removed all markers!"
    redirect_to '/places'
  end
  
  def choose
    @chosen = Place.find(params[:id])
    # save to session. @chosen hash can be accessed using 'get_chosen_location' method
    # in sessions_helper
    session[:chosen_attributes] = @chosen.attributes
    respond_to do |format|
      format.html { redirect_to game_url, notice: "Place chosen: #{@chosen[:address]}" }
      format.json { render :index, status: :ok, location: @chosen }
    end
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def place_params
      params.require(:place).permit(:latitude, :longitude, :address, :title)
    end
end
