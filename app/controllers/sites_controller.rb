require 'csv'

class SitesController < ApplicationController
  before_action :set_site, only: %i[edit update destroy delete_image_attachment add_image_attachment]

  def index
    @site = Site.first
  end

  def new
    @site = Site.new
  end

  def edit
  end

  def create
    @site = Site.new(site_params)
    if @site.save
      redirect_to sites_path
    else
      redirect_to new_site_path
    end
  end

  def update
    @site.update(site_params)
    redirect_to sites_path
  end

  def destroy
    @site.destroy
    redirect_to admin_path
  end

  def delete_image_attachment
    file_name = params[:file_name]
    Net::FTP.open(ENV.fetch("FTP_SERVER", nil)) do |ftp|
      ftp.login(ENV.fetch("FTP_USER", nil), ENV.fetch("FTP_PWD", nil))
      ftp.chdir(ENV.fetch("FTP_DIRECTORY", nil))
      ftp.delete(params[:file_name])
      @site.picture.delete(file_name) if params[:type] == 'picture'
    end
    @site.save!
    redirect_to edit_site_path(@site)
  end

  def add_image_attachment
    @picture_params = picture_params
    @picture_params[:picture].each do |picture|
      Net::FTP.open(ENV.fetch("FTP_SERVER", nil)) do |ftp|
        ftp.login(ENV.fetch("FTP_USER", nil), ENV.fetch("FTP_PWD", nil))
        ftp.chdir(ENV.fetch("FTP_DIRECTORY", nil))
        file_name = "#{rand(36**12).to_s(36)}.#{picture.content_type.split('/')[1]}"
        ftp.storbinary("STOR #{file_name}", StringIO.new(picture.read), Net::FTP::DEFAULT_BLOCKSIZE)
        if params[:type] == 'picture'
          @site.picture << file_name
        elsif params[:type] == "other_picture"
          @site.other_picture << file_name
        end
      end
    end
    @site.save!
    redirect_to edit_site_path(@site)
  end

  private

  def set_site
    @site = Site.first
  end

  def site_params
    params.require(:site).permit(:id, :about1, :about2, :about3, :history, :institution, :goal, :problem, :observation, :picture,
                                 :quality_control_file, :vandalism_file, :article_file, :pnt_file, :other_picture)
  end

  def picture_params
    params.require(:site).permit(
      picture: []
    )
  end
end
