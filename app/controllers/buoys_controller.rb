require 'csv'


class BuoysController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :edit, :create, :update, :destroy, :new, :delete_image_attachment, :add_image_attachment]
  before_action :set_buoy, only: [:show, :edit, :update, :delete_image_attachment, :add_image_attachment]
  before_action :set_variable, only: [:index]
  before_action :set_variable_full, only: [:show]

  def index
    @lasts = get_last_data()  
  end

  def show
    @end_date = (Date.parse @last['date_time']) + 1.day
    @start_date = (Date.parse @last['date_time']) - 5.day
  end


  def new
    @buoy = Buoy.new
  end

  def create
    @buoy = Buoy.new(buoy_params)
    redirect_to admin_path
  end

  def edit
  end

  def update
    @buoy = update_buoy(@buoy)
    @buoy.update(buoy_params)
    redirect_to buoy_path(@buoy)
  end

  # def destroy
  #   @sensor.destroy
  #   redirect_to root_path
  # end

  def delete_image_attachment
    file_name = params[:file_name]
    Net::FTP.open(ENV["FTP_SERVER"]) do |ftp|
      ftp.login(user = ENV["FTP_USER"], passwd = ENV["FTP_PWD"])
      ftp.chdir(ENV["FTP_DIRECTORY"])
      ftp.delete(params[:file_name])
      if params[:type] == 'picture'
        @buoy.picture.delete(file_name)
      elsif params[:type] == "profile_picture"
        @buoy.profile_picture.delete(file_name)
      elsif params[:type] == "dimension_picture"
        @buoy.dimension_picture.delete(file_name)
      elsif params[:type] == "mooring_picture"
        @buoy.mooring_picture.delete(file_name)
      elsif params[:type] == "working_cycle_picture"
        @buoy.working_cycle_picture.delete(file_name)
      end
    end
    @buoy.save!
    redirect_to edit_buoy_path(@buoy)

  end

  def add_image_attachment
    @picture_params = picture_params
    @picture_params[:picture].each do |picture|
      Net::FTP.open(ENV["FTP_SERVER"]) do |ftp|
        ftp.login(user = ENV["FTP_USER"], passwd = ENV["FTP_PWD"])
        ftp.chdir(ENV["FTP_DIRECTORY"])
        file_name = "#{rand(36**12).to_s(36)}.#{picture.content_type.split('/')[1]}"
        ftp.storbinary("STOR #{file_name}", StringIO.new(picture.read), Net::FTP::DEFAULT_BLOCKSIZE)
        if params[:type] == 'picture'
          @buoy.picture << file_name
        elsif params[:type] == "profile_picture"
          @buoy.profile_picture << file_name
        elsif params[:type] == "dimension_picture"
          @buoy.dimension_picture << file_name
        elsif params[:type] == "mooring_picture"
          @buoy.mooring_picture << file_name
        elsif params[:type] == "working_cycle_picture"
          @buoy.working_cycle_picture << file_name
        end
      end
    end
    @buoy.save!
    redirect_to edit_buoy_path(@buoy)
  end

  def admin
    # if current_user.user_type == admin
    @buoys = Buoy.all     
  end

  def download
    params.permit!
    @file_download = params[:buoy_download]
    @firsts = get_last_data(false, false)
    @lasts = get_last_data()
    @user = get_token(current_user.email)
  end

  def download_csv
    params.permit!
    file_name = "boia#{params[:buoy_download]}_#{params[:start_date]}_#{params[:end_date]}.csv"

    @user = get_token(current_user.email)
    @buoys_data = get_buoy_data(params, token = @user["token"], csv_gen=true)

    # send_data @buoys_data.gsub!(';',"\n"), filename: file_name
    send_data @buoys_data, filename: file_name
  end

  def pnboia
    @site = Site.first
  end
  
  private

  def set_buoy
    @last = get_last_data(buoy_id = params[:id])
    @buoy = Buoy.where("buoy_id=#{params[:id]}")[0]
  end

  def buoy_params
    params.require(:buoy).permit(:buoy_id,:hull_id,:name,:deploy_date,:latitude,:longitude,:status,:mode,:wmo_number,:antenna_id,:open_data,:link_site_pnboia,:project_id,:manufacturer,:model,:diameter,:weight,:depth,:sensor_description,:working_cycle,:observation,:picture,:profile_picture,:dimension_picture,:mooring_picture,:working_cycle_picture)
  end

  def picture_params
    params.require(:buoy).permit(
      picture: []
      )
  end

  def update_buoy(buoy)
    begin
      buoy_api = {
        "hull_id": buoy.hull_id,
        "name": buoy.name,
        "deploy_date": buoy.deploy_date,
        "latitude": buoy.latitude,
        "longitude": buoy.longitude,
        "status": buoy.status,
        "mode": buoy.mode,
        "wmo_number": buoy.wmo_number,
        "antenna_id": buoy.antenna_id,
        "open_data": buoy.open_data,
        "link_site_pnboia": buoy.link_site_pnboia,
        "project_id": buoy.project_id
      }
      url = "/v1/moored/buoys/#{buoy.buoy_id}&token=#{ENV["PNBOIA_API_TOKEN"]}"

      response = RestClient.put(url, header=buoy_api)
      return remobs_response['token']
    rescue
      return
    end
  end

  
  def get_token(email)
    begin
      url = "#{ENV["PNBOIA_API_URI"]}/auth/?email=#{email}&token=#{ENV["PNBOIA_API_TOKEN"]}"
      response = RestClient.get(url)
      remobs_response = JSON.parse(response)
      return remobs_response['token']
    rescue
      return
    end
  end

  def get_buoy_data(params, token, csv_gen)
    begin
      url = "#{ENV["PNBOIA_API_URI"]}/v1/qualified_data/qualified_data?buoy_id=#{params[:buoy_download]}&start_date=#{params[:start_date]}&end_date=#{params[:end_date]}&token=#{token}"
      response = RestClient.get(url)
      remobs_response = JSON.parse(response)
      if csv_gen
        csv_string = CSV.generate do |csv|
          remobs_response.each_with_index do |item, idx|
            if idx == 0
              csv << item.keys
            end
            csv << item.values
          end
        end
        return csv_string
      end  
      params = {}
      remobs_response.each do |item|
        item.each do |key, value|
          if !params[key]
            params[key] = []
          end
          params[key] << value
        end
      end      
      return params
    rescue
      return []
    end
  end

  def get_buoys()
    begin
      response = RestClient.get("#{ENV["PNBOIA_API_URI"]}/v1/moored/buoys?order=True&token=#{ENV["PNBOIA_API_TOKEN"]}")
      remobs_response = JSON.parse(response)

      params = []

      remobs_response.each do |item|
        params << item
      end
      return params
    rescue
      return []
    end
  end

  def get_last_data(buoy_id=false, last=true)
    puts("XXX")
    puts(last)
    puts("XXX")
    begin
      url = "#{ENV["PNBOIA_API_URI"]}/v1/qualified_data/qualified_data/last?token=#{ENV["PNBOIA_API_TOKEN"]}"
      if last == false
        url +="&last=false"
        puts(url)
      end
      response = RestClient.get(url)
      remobs_response = JSON.parse(response)
      params = []
      if !buoy_id
        remobs_response.each do |item|
          params << item
        end
      else
        remobs_response.each do |item|
          if item['buoy_id'].to_i == buoy_id.to_i
            params = item
            return params
          end
        end
      end
      return params
    rescue
      return []
    end
  end

  def set_variable
    @meteorologys = {'wspd1': ["VEL. VENTO 1", 'nós'],'wdir1': ["DIR. VENTO 1", '°'], 'gust1': ["RAJADA 1", 'nós'],
      'wspd2': ["VEL. VENTO 2", 'nós'],'wdir2': ["DIR. VENTO 2", '°'], 'gust2': ["RAJADA 2", 'nós'],
      'atmp': ['TEMP. AR', '°C'], 'pres': ['PRESSÃO', 'mb'], 'srad': ['RADIAÇÃO', 'W/m²'],
      'rh': ['UMIDADE REL.', '%'], 'dewpt': ['T. ORVALHO', '°C']}
    @oceanographys = {'sst': ['TEMP. ÁGUA', '°C'], 'sss': ['SALINIDADE', ' '],
      'cspd1': ['VEL.CORR1', 'm/s'], 'cdir1': ['DIR.CORR1', '°'],
      'cspd2': ['VEL.CORR1', 'm/s'], 'cdir2': ['DIR.CORR2', '°'],
      'cspd3': ['VEL.CORR3', 'm/s'], 'cdir3': ['DIR.CORR3', '°']}
    
    @waves = {'swvht1': ['ALTURA SIG.1', 'm'], 'tp1': ['PER. PICO.1', 's'],
      'mxwvht1': ['ALTURA MAX.1', 'm'], 'wvdir1': ['DIR. MÉDIA1', '°'],
      'wvspread1': ['ESPALHAMENTO 1', '°'],
      'swvht2': ['ALTURA SIG.2', 'm'], 'tp2': ['PER. PICO.2', 's'],
      'wvdir2': ['DIR. MÉDIA2', '°']}    
  end


  def set_variable_full
    @meteorologys = {'wspd1': ["VEL. VENTO 1", 'nós'],'wdir1': ["DIR. VENTO 1", '°'], 'gust1': ["RAJADA 1", 'nós'],
      'wspd2': ["VEL. VENTO 2", 'nós'],'wdir2': ["DIR. VENTO 2", '°'], 'gust2': ["RAJADA 2", 'nós'],
      'atmp': ['TEMP. AR', '°C'], 'pres': ['PRESSÃO', 'mb'], 'srad': ['RADIAÇÃO', 'W/m²'],
      'rh': ['UMIDADE REL.', '%'], 'dewpt': ['T. ORVALHO', '°C']}
    @oceanographys = {'sst': ['TEMP. ÁGUA', '°C'], 'sss': ['SALINIDADE', ' '],
      'cspd1': ['VEL.CORR1', 'm/s'], 'cdir1': ['DIR.CORR1', '°'],
      'cspd2': ['VEL.CORR1', 'm/s'], 'cdir2': ['DIR.CORR2', '°'],
      'cspd3': ['VEL.CORR3', 'm/s'], 'cdir3': ['DIR.CORR3', '°'],
      'cspd4': ['VEL.CORR4', 'm/s'], 'cdir4': ['DIR.CORR4', '°'],
      'cspd5': ['VEL.CORR5', 'm/s'], 'cdir5': ['DIR.CORR5', '°'],
      'cspd6': ['VEL.CORR6', 'm/s'], 'cdir6': ['DIR.CORR6', '°'],
      'cspd7': ['VEL.CORR7', 'm/s'], 'cdir7': ['DIR.CORR7', '°'],
      'cspd8': ['VEL.CORR8', 'm/s'], 'cdir8': ['DIR.CORR8', '°'],
      'cspd9': ['VEL.CORR9', 'm/s'], 'cdir9': ['DIR.CORR9', '°'],
      'cspd10': ['VEL.CORR10', 'm/s'], 'cdir10': ['DIR.CORR10', '°'],
      'cspd11': ['VEL.CORR11', 'm/s'], 'cdir11': ['DIR.CORR11', '°'],
      'cspd12': ['VEL.CORR12', 'm/s'], 'cdir12': ['DIR.CORR12', '°'],
      'cspd13': ['VEL.CORR13', 'm/s'], 'cdir13': ['DIR.CORR13', '°'],
      'cspd14': ['VEL.CORR14', 'm/s'], 'cdir14': ['DIR.CORR14', '°'],
      'cspd15': ['VEL.CORR15', 'm/s'], 'cdir15': ['DIR.CORR15', '°'],
      'cspd16': ['VEL.CORR16', 'm/s'], 'cdir16': ['DIR.CORR16', '°'],
      'cspd17': ['VEL.CORR17', 'm/s'], 'cdir17': ['DIR.CORR17', '°'],
      'cspd18': ['VEL.CORR18', 'm/s'], 'cdir18': ['DIR.CORR18', '°'],
      'cspd19': ['VEL.CORR19', 'm/s'], 'cdir19': ['DIR.CORR19', '°'],
      'cspd20': ['VEL.CORR20', 'm/s'], 'cdir20': ['DIR.CORR20', '°']}
    
    @waves = {'swvht1': ['ALTURA SIG.1', 'm'], 'tp1': ['PER. PICO.1', 's'],
      'mxwvht1': ['ALTURA MAX.1', 'm'], 'wvdir1': ['DIR. MÉDIA1', '°'],
      'wvspread1': ['ESPALHAMENTO 1', '°'], "tm1": ['PER. MÉDIO1', 's'],
      'pkdir1': ['DIR. PICO1', '°'], "pkspread1": ['ESPALHAMENTO PICO1', '°'],
      'swvht2': ['ALTURA SIG.2', 'm'], 'tp2': ['PER. PICO.2', 's'],
      'wvdir2': ['DIR. MÉDIA2', '°']}
  end


end
