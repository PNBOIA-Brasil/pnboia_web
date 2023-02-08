class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home, :position, :english, :operantarxl, :operantarxl_en]

  def admin
    if current_user.admin
      @systems = System.all
      @system = System.new
    else
      redirect_to root_path
    end
  end

  def home
    @lasts = get_last_data()
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
  def old_home
    if params[:commit]
      @popup = false
      start_date = params[:start_date]
      end_date = params[:end_date]
      start_date = Date.parse start_date
      end_date = Date.parse end_date
    else
      @popup = true
      start_date = (Time.now - 1.day)
      end_date = (Time.now + 1.day)
    end
    if start_date == nil
      start_date = (Time.now - 5.day)
    end
    if end_date == nil
      end_date = Time.now + 1.day
    end
    if start_date < (Time.now - 5.day)
      start_date = (Time.now - 5.day)
    end
    if end_date < start_date
      end_date = Time.now + 1.day
    end

    @start_date = start_date
    @end_date = end_date

    @almirantado_int = NewSystem.where("name ='almirantado_int' ") [0]
    @almirantado_ext = NewSystem.where("name ='almirantado_ext' ") [0]
    @inpe = NewSystem.where("name ='inpe' ") [0]
    @potter = NewSystem.where("name ='potter' ") [0]

    @almirantado_int_data = get_remobs_new(@almirantado_int, start_date, end_date)
    @almirantado_ext_data = get_remobs_new(@almirantado_ext, start_date, end_date)
    @inpe_data = get_remobs_new(@inpe, start_date, end_date)
    @potter_data = get_remobs_new(@potter, start_date, end_date)

    start_date = (Time.now - 5.day)
    end_date = Time.now + 1.day
    @drifters = get_remobs_sofar(start_date, end_date)
    @systems = [@almirantado_int, @almirantado_ext, @inpe, @potter]

  end

  def english
    if params[:commit]
      @popup = false
      start_date = params[:start_date]
      end_date = params[:end_date]
      start_date = Date.parse start_date
      end_date = Date.parse end_date
    else
      @popup = true
      start_date = (Time.now - 1.day)
      end_date = (Time.now + 1.day)
    end
    if start_date == nil
      start_date = (Time.now - 5.day)
    end
    if end_date == nil
      end_date = Time.now + 1.day
    end
    if start_date < (Time.now - 5.day)
      start_date = (Time.now - 5.day)
    end
    if end_date < start_date
      end_date = Time.now + 1.day
    end

    @start_date = start_date
    @end_date = end_date

    @almirantado_int = NewSystem.where("name ='almirantado_int' ") [0]
    @almirantado_ext = NewSystem.where("name ='almirantado_ext' ") [0]
    @inpe = NewSystem.where("name ='inpe' ") [0]
    @potter = NewSystem.where("name ='potter' ") [0]

    @almirantado_int_data = get_remobs_new(@almirantado_int, start_date, end_date)
    @almirantado_ext_data = get_remobs_new(@almirantado_ext, start_date, end_date)
    @inpe_data = get_remobs_new(@inpe, start_date, end_date)
    @potter_data = get_remobs_new(@potter, start_date, end_date)

    start_date = (Time.now - 5.day)
    end_date = Time.now + 1.day
    @drifters = get_remobs_sofar(start_date, end_date)

    @systems = [@almirantado_int, @almirantado_ext, @inpe, @potter]
  end

  private


  def get_buoys()
    begin
      response = RestClient.get("http://52.67.222.63/v1/moored/buoys?order=True&token=#{ENV["PNBOIA_TOKEN"]}")
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

  def get_last_data()
    begin
      response = RestClient.get("http://52.67.222.63/v1/qualified_data/qualified_data/last?token=#{ENV["PNBOIA_TOKEN"]}")
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
  def get_remobs_sofar(start_date, end_date)
    begin
      response = RestClient.get("http://remobsapi.herokuapp.com/api/v2/drift_values/last?start_date=#{start_date.strftime("%Y-%m-%d")}&end_date=#{end_date.strftime("%Y-%m-%d")}&token=#{ENV["REMOBS_TOKEN"]}")

      remobs_response = JSON.parse(response)

      params_total = []
      params = {}

      remobs_response.each do |item|
        params = {}
        if item['latitude']
          if item['buoy_id'].to_i > 139
            params[:date_time] = Time.parse(item['date_time'])
            params[:buoy_id] = item['buoy_id']
            params[:swvht] = (item['swvht1'].to_f).round(2)
            params[:tp] = (item['tp1'].to_f).round(1)
            params[:wvspread] = item['wvspread1'].to_f
            params[:wdir] = item['wdir1'].to_i
            params[:sst] = item['sst'].to_f
            params[:wspd] = (item['wspd1'].to_f * 1.94384).round(2)
            params[:wvdir] = (item['wvdir1'].to_f).round()
            params[:lat] = item['latitude'].to_f
            params[:lon] = item['longitude'].to_f
            params_total << params
          end
        end
      end
      return params_total
    rescue
      return []
    end
  end


  def get_remobs_new(buoy, start_date, end_date)
    if buoy.buoy_id
      begin
        response = RestClient.get("http://remobsapi.herokuapp.com/api/v2/qualified_values?buoy=#{buoy.buoy_id.to_i}&start_date=#{start_date.strftime("%Y-%m-%d")}&end_date=#{end_date.strftime("%Y-%m-%d")}&token=#{ENV["REMOBS_TOKEN"]}")

        remobs_response = JSON.parse(response)

        params = {}
        params[:swvht] = []
        params[:mxwvht] = []
        params[:tp] = []
        params[:sst] = []
        params[:wvspread] = []
        params[:wvdir] = []
        params[:date_time] = []
        params[:buoy_id] = []
        params[:wspd] = []
        params[:wdir] = []
        params[:gust] = []
        params[:wvdirg] = []
        params[:wdirg] = []
        params[:pres] = []
        params[:rh] = []
        params[:sss] = []
        params[:atmp] = []
        params[:srad] = []


        remobs_response.each do |item|
          params[:buoy_id] << item['buoy_id']

          if item['flag_swvht1'].to_i > 0 || item['flag_swvht1'] == nil
            params[:swvht] << nil
          else
            params[:swvht] << item['swvht1'].to_f
          end

          if item['flag_mxwvht1'].to_i > 0 || item['flag_mxwvht1'] == nil
            params[:mxwvht] << nil
          else
            params[:mxwvht] << item['mxwvht1'].to_f
          end

          if item['flag_tp1'].to_i > 0 || item['flag_tp1'] == nil
            params[:tp] << nil
          else
            params[:tp] << item['tp1'].to_f
          end

          if item['flag_sst'].to_i > 0 || item['flag_sst'] == nil
            params[:sst] << nil
          else
            params[:sst] << item['sst'].to_f
          end

          if item['flag_wvspread1'].to_i > 0 || item['flag_wvspread1'] == nil
            params[:wvspread] << nil
          else
            params[:wvspread] << item['wvspread1'].to_f
          end

          params[:date_time] << Time.parse(item['date_time'])

          if item['flag_wdir1'].to_i > 0 || item['flag_wdir1'] == nil
            params[:wdir] << nil
          else
            params[:wdir] << item['wdir1'].to_i
          end

          if item['flag_wdir1'].to_i > 0 || item['flag_wdir1'] == nil
            params[:wdirg] << nil
          else
            params[:wdirg] << (item['wdir1'].to_i/10)*10
          end

          if item['flag_gust1'].to_i > 0 || item['flag_gust1'] == nil
            params[:gust] << nil
          else
            params[:gust] << (item['gust1'].to_f * 1.94384).round(2)
          end

          if item['flag_wspd1'].to_i > 0 || item['flag_wspd1'] == nil
            params[:wspd] << nil
          else
            params[:wspd] << (item['wspd1'].to_f * 1.94384).round(2)
          end

          if item['flag_wvdir1'].to_i > 0 || item['flag_wvdir1'] == nil
            params[:wvdir] << nil
          else
            params[:wvdir] << item['wvdir1'].to_f
          end

          if item['flag_wvdir1'].to_i > 0 || item['flag_wvdir1'] == nil
            params[:wvdirg] << nil
          else
            params[:wvdirg] << (item['wvdir1'].to_i/10)*10
          end

          if item['flag_pres'].to_i > 0 || item['flag_pres'] == nil
            params[:pres] << nil
          else
            params[:pres] << item['pres'].to_f
          end

          if item['flag_rh'].to_i > 0 || item['flag_rh'] == nil
            params[:rh] << nil
          else
            params[:rh] << item['rh'].to_f
          end

          if item['flag_sss'].to_i > 0 || item['flag_sss'] == nil
            params[:sss] << nil
          else
            params[:sss] << item['sss'].to_f
          end

          if item['flag_atmp'].to_i > 0 || item['flag_atmp'] == nil
            params[:atmp] << nil
          else
            params[:atmp] << item['atmp'].to_f
          end

          if item['flag_srad'].to_i > 0 || item['flag_srad'] == nil
            params[:srad] << nil
          else
            params[:srad] << item['srad'].to_f
          end

        end
        return params
      rescue
        return {}
      end
    else
      return {}
    end
  end

end
