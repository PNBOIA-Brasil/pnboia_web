require 'csv'

class BuoysController < ApplicationController
  skip_before_action :authenticate_user!,
                     only: %i[index edit create update destroy new delete_image_attachment add_image_attachment]
  before_action :set_buoy, only: %i[show edit update destroy delete_image_attachment add_image_attachment]
  before_action :set_variable, only: [:index]
  before_action :set_variable_full, only: [:show]

  def index
    @lasts = get_last_data
    @site = Site.first
  end

  def show
    @end_date = (Date.parse @last['date_time']) + 1.day
    @start_date = (Date.parse @last['date_time']) - 5.days
  end

  def new
    @buoy = Buoy.new
  end

  def edit
  end

  def create
    @buoy = Buoy.new(buoy_params)
    @buoy.id = Buoy.maximum(:buoy_id) + 1

    if !Buoy.where(name: @buoy.name).empty?
      error = "Ja existe uma boia com o nome '#{@buoy.name}'."
      redirect_to new_buoy_path, notice: error
    elsif @buoy.save
      @buoy1 = create_buoy(@buoy)
      redirect_to edit_buoy_path(@buoy)
    else
      error = "Nao foi possivel salvar a boia no banco de dados. Tente mais uma vez"
      redirect_to new_buoy_path, notice: error
    end
  end

  def update
    @buoy_bd = update_buoy(@buoy)
    # @buoy_params = buoy_params
    @buoy.update(buoy_params)
    redirect_to buoy_path(@buoy)
  end

  def destroy
    @buoy.destroy
    @buoy = delete_buoy(@buoy)
    redirect_to admin_path
  end

  def delete_image_attachment
    file_name = params[:file_name]
    Net::FTP.open(ENV.fetch("FTP_SERVER", nil)) do |ftp|
      ftp.login(ENV.fetch("FTP_USER", nil), ENV.fetch("FTP_PWD", nil))
      ftp.chdir(ENV.fetch("FTP_DIRECTORY", nil))
      ftp.delete(params[:file_name])
      case params[:type]
      when 'picture'
        @buoy.picture.delete(file_name)
      when "profile_picture"
        @buoy.profile_picture.delete(file_name)
      when "dimension_picture"
        @buoy.dimension_picture.delete(file_name)
      when "mooring_picture"
        @buoy.mooring_picture.delete(file_name)
      when "working_cycle_picture"
        @buoy.working_cycle_picture.delete(file_name)
      end
    end
    @buoy.save!
    redirect_to edit_buoy_path(@buoy)
  end

  def add_image_attachment
    @picture_params = picture_params
    @picture_params[:picture].each do |picture|
      Net::FTP.open(ENV.fetch("FTP_SERVER", nil)) do |ftp|
        ftp.login(ENV.fetch("FTP_USER", nil), ENV.fetch("FTP_PWD", nil))
        ftp.chdir(ENV.fetch("FTP_DIRECTORY", nil))
        file_name = "#{rand(36**12).to_s(36)}.#{picture.content_type.split('/')[1]}"
        ftp.storbinary("STOR #{file_name}", StringIO.new(picture.read), Net::FTP::DEFAULT_BLOCKSIZE)
        case params[:type]
        when 'picture'
          @buoy.picture << file_name
        when "profile_picture"
          @buoy.profile_picture << file_name
        when "dimension_picture"
          @buoy.dimension_picture << file_name
        when "mooring_picture"
          @buoy.mooring_picture << file_name
        when "working_cycle_picture"
          @buoy.working_cycle_picture << file_name
        end
      end
    end
    @buoy.save!
    redirect_to edit_buoy_path(@buoy)
  end

  def admin
    # if current_user.user_type == admin
    @site = Site.first
    @buoys = Buoy.all
  end

  def download
    params.permit!
    @file_download = params[:buoy_download]
    @firsts = get_last_data(false, false)
    @lasts = get_last_data
    @user = get_token(current_user.email)
  end

  def download_csv
    params.permit!
    file_name = "boia#{params[:buoy_download]}_#{params[:start_date]}_#{params[:end_date]}.csv"

    @user = get_token(current_user.email)
    @buoys_data = get_buoy_data(params, @user["token"], true)

    # send_data @buoys_data.gsub!(';',"\n"), filename: file_name
    send_data @buoys_data, filename: file_name
  end

  def pnboia
    @site = Site.first
  end

  private

  def set_buoy
    @last = get_last_data(params[:id])
    @buoy = Buoy.where("buoy_id=#{params[:id]}")[0]
  end

  def buoy_params
    params.require(:buoy).permit(:buoy_id, :hull_id, :name, :deploy_date, :latitude, :longitude, :status, :mode, :wmo_number,
                                 :antenna_id, :open_data, :link_site_pnboia, :project_id, :manufacturer, :model, :diameter, :weight, :depth, :sensor_description, :working_cycle, :observation, :dimension_description, :mooring_description, :picture, :profile_picture, :dimension_picture, :mooring_picture, :working_cycle_picture)
  end

  def picture_params
    params.require(:buoy).permit(
      picture: []
    )
  end

  def create_buoy(buoy)
    buoy_object = create_buoy_object(buoy)
    url = "#{ENV.fetch('PNBOIA_API_URI', nil)}/v1/moored/buoys?token=#{ENV.fetch('PNBOIA_API_TOKEN', nil)}"
    response = RestClient.post(url, buoy_object.to_json, content_type: :json)
    remobs_response = JSON.parse(response)
    return remobs_response
  rescue StandardError
    return
  end

  def delete_buoy(buoy)
    url = "#{ENV.fetch('PNBOIA_API_URI',
                       nil)}/v1/moored/buoys/#{buoy.buoy_id}?token=#{ENV.fetch('PNBOIA_API_TOKEN', nil)}"
    response = RestClient.delete(url)
    remobs_response = JSON.parse(response)
    return remobs_response
  rescue StandardError
    return
  end

  def update_buoy(buoy)
    buoy_object = create_buoy_object(buoy)

    url = "#{ENV.fetch('PNBOIA_API_URI',
                       nil)}/v1/moored/buoys/#{buoy.buoy_id}?token=#{ENV.fetch('PNBOIA_API_TOKEN', nil)}"
    Rails.logger.debug buoy_object

    response = RestClient.put(url, buoy_object)
    remobs_response = JSON.parse(response)
    return remobs_response
  rescue StandardError
    return
  end

  def create_buoy_object(buoy)
    buoy_api = {}
    buoy.hull_id ? buoy_api["hull_id"] = buoy.hull_id : nil
    buoy.name ? buoy_api["name"] = buoy.name : nil
    buoy.deploy_date ? buoy_api["deploy_date"] = buoy.deploy_date.strftime("%Y-%m-%d") : nil
    buoy.latitude ? buoy_api["latitude"] = buoy.latitude : nil
    buoy.longitude ? buoy_api["longitude"] = buoy.longitude : nil
    buoy_api["status"] = buoy.status
    buoy.mode ? buoy_api["mode"] = buoy.mode : nil
    buoy.wmo_number ? buoy_api["wmo_number"] = buoy.wmo_number : nil
    buoy.antenna_id ? buoy_api["antenna_id"] = buoy.antenna_id : nil
    buoy_api["open_data"] = buoy.open_data
    buoy.link_site_pnboia ? buoy_api["link_site_pnboia"] = buoy.link_site_pnboia : nil
    buoy.project_id ? buoy_api["project_id"] = buoy.project_id : nil

    return buoy_api
  end

  def get_token(email)
    url = "#{ENV.fetch('PNBOIA_API_URI', nil)}/auth/?email=#{email}&token=#{ENV.fetch('PNBOIA_API_TOKEN', nil)}"
    response = RestClient.get(url)
    remobs_response = JSON.parse(response)
    return remobs_response['token']
  rescue StandardError
    return
  end

  def get_buoy_data(params, token, csv_gen)
    url = "#{ENV.fetch('PNBOIA_API_URI',
                       nil)}/v1/qualified_data/qualified_data?buoy_id=#{params[:buoy_download]}&start_date=#{params[:start_date]}&end_date=#{params[:end_date]}&token=#{token}"
    response = RestClient.get(url)
    remobs_response = JSON.parse(response)
    if csv_gen
      csv_string = CSV.generate do |csv|
        remobs_response.each_with_index do |item, idx|
          csv << item.keys if idx.zero?
          csv << item.values
        end
      end
      return csv_string
    end
    params = {}
    remobs_response.each do |item|
      item.each do |key, value|
        params[key] = [] unless params[key]
        params[key] << value
      end
    end
    return params
  rescue StandardError
    return []
  end

  def get_buoys
    response = RestClient.get("#{ENV.fetch('PNBOIA_API_URI',
                                           nil)}/v1/moored/buoys?order=True&token=#{ENV.fetch('PNBOIA_API_TOKEN',
                                                                                              nil)}")
    remobs_response = JSON.parse(response)

    params = []

    remobs_response.each do |item|
      params << item
    end
    return params
  rescue StandardError
    return []
  end

  def get_last_data(buoy_id = false, last = true)
    Rails.logger.debug("XXX")
    Rails.logger.debug(last)
    Rails.logger.debug("XXX")
    begin
      url = "#{ENV.fetch('PNBOIA_API_URI',
                         nil)}/v1/qualified_data/qualified_data/last?token=#{ENV.fetch('PNBOIA_API_TOKEN', nil)}"
      if last == false
        url += "&last=false"
        Rails.logger.debug(url)
      end
      response = RestClient.get(url)
      remobs_response = JSON.parse(response)
      params = []
      if buoy_id
        remobs_response.each do |item|
          if item['buoy_id'].to_i == buoy_id.to_i
            params = item
            return params
          end
        end
      else
        remobs_response.each do |item|
          params << item
        end
      end
      return params
    rescue StandardError
      return []
    end
  end

  def set_variable
    @meteorologys = { wspd1: ["VEL. VENTO 1", 'nós'], wdir1: ["DIR. VENTO 1", '°'], gust1: ["RAJADA 1", 'nós'],
                      wspd2: ["VEL. VENTO 2", 'nós'], wdir2: ["DIR. VENTO 2", '°'], gust2: ["RAJADA 2", 'nós'],
                      atmp: ['TEMP. AR', '°C'], pres: ['PRESSÃO', 'mb'], srad: ['RADIAÇÃO', 'W/m²'],
                      rh: ['UMIDADE REL.', '%'], dewpt: ['T. ORVALHO', '°C'] }
    @oceanographys = { sst: ['TEMP. ÁGUA', '°C'], sss: ['SALINIDADE', ' '],
                       cspd1: ['VEL.CORR1', 'm/s'], cdir1: ['DIR.CORR1', '°'],
                       cspd2: ['VEL.CORR1', 'm/s'], cdir2: ['DIR.CORR2', '°'],
                       cspd3: ['VEL.CORR3', 'm/s'], cdir3: ['DIR.CORR3', '°'] }

    @waves = { swvht1: ['ALTURA SIG.1', 'm'], tp1: ['PER. PICO.1', 's'],
               mxwvht1: ['ALTURA MAX.1', 'm'], wvdir1: ['DIR. MÉDIA1', '°'],
               wvspread1: ['ESPALHAMENTO 1', '°'],
               swvht2: ['ALTURA SIG.2', 'm'], tp2: ['PER. PICO.2', 's'],
               wvdir2: ['DIR. MÉDIA2', '°'] }
  end

  def set_variable_full
    @meteorologys = { wspd1: ["VEL. VENTO 1", 'nós'], wdir1: ["DIR. VENTO 1", '°'], gust1: ["RAJADA 1", 'nós'],
                      wspd2: ["VEL. VENTO 2", 'nós'], wdir2: ["DIR. VENTO 2", '°'], gust2: ["RAJADA 2", 'nós'],
                      atmp: ['TEMP. AR', '°C'], pres: ['PRESSÃO', 'mb'], srad: ['RADIAÇÃO', 'W/m²'],
                      rh: ['UMIDADE REL.', '%'], dewpt: ['T. ORVALHO', '°C'] }
    @oceanographys = { sst: ['TEMP. ÁGUA', '°C'], sss: ['SALINIDADE', ' '],
                       cspd1: ['VEL.CORR1', 'm/s'], cdir1: ['DIR.CORR1', '°'],
                       cspd2: ['VEL.CORR1', 'm/s'], cdir2: ['DIR.CORR2', '°'],
                       cspd3: ['VEL.CORR3', 'm/s'], cdir3: ['DIR.CORR3', '°'],
                       cspd4: ['VEL.CORR4', 'm/s'], cdir4: ['DIR.CORR4', '°'],
                       cspd5: ['VEL.CORR5', 'm/s'], cdir5: ['DIR.CORR5', '°'],
                       cspd6: ['VEL.CORR6', 'm/s'], cdir6: ['DIR.CORR6', '°'],
                       cspd7: ['VEL.CORR7', 'm/s'], cdir7: ['DIR.CORR7', '°'],
                       cspd8: ['VEL.CORR8', 'm/s'], cdir8: ['DIR.CORR8', '°'],
                       cspd9: ['VEL.CORR9', 'm/s'], cdir9: ['DIR.CORR9', '°'],
                       cspd10: ['VEL.CORR10', 'm/s'], cdir10: ['DIR.CORR10', '°'],
                       cspd11: ['VEL.CORR11', 'm/s'], cdir11: ['DIR.CORR11', '°'],
                       cspd12: ['VEL.CORR12', 'm/s'], cdir12: ['DIR.CORR12', '°'],
                       cspd13: ['VEL.CORR13', 'm/s'], cdir13: ['DIR.CORR13', '°'],
                       cspd14: ['VEL.CORR14', 'm/s'], cdir14: ['DIR.CORR14', '°'],
                       cspd15: ['VEL.CORR15', 'm/s'], cdir15: ['DIR.CORR15', '°'],
                       cspd16: ['VEL.CORR16', 'm/s'], cdir16: ['DIR.CORR16', '°'],
                       cspd17: ['VEL.CORR17', 'm/s'], cdir17: ['DIR.CORR17', '°'],
                       cspd18: ['VEL.CORR18', 'm/s'], cdir18: ['DIR.CORR18', '°'],
                       cspd19: ['VEL.CORR19', 'm/s'], cdir19: ['DIR.CORR19', '°'],
                       cspd20: ['VEL.CORR20', 'm/s'], cdir20: ['DIR.CORR20', '°'] }

    @waves = { swvht1: ['ALTURA SIG.1', 'm'], tp1: ['PER. PICO.1', 's'],
               mxwvht1: ['ALTURA MAX.1', 'm'], wvdir1: ['DIR. MÉDIA1', '°'],
               wvspread1: ['ESPALHAMENTO 1', '°'], tm1: ['PER. MÉDIO1', 's'],
               pkdir1: ['DIR. PICO1', '°'], pkspread1: ['ESPALHAMENTO PICO1', '°'],
               swvht2: ['ALTURA SIG.2', 'm'], tp2: ['PER. PICO.2', 's'],
               wvdir2: ['DIR. MÉDIA2', '°'] }
  end
end
