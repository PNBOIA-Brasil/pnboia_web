class AddFiles < ActiveRecord::Migration[6.0]
  def change
    add_column :buoys, :picture, :text
    add_column :buoys, :profile_picture, :text
    add_column :buoys, :dimension_picture, :text
    add_column :buoys, :mooring_picture, :text
    add_column :buoys, :working_cycle_picture, :text
    add_column :sites, :picture, :text
    add_column :sites, :quality_control_file, :text
    add_column :sites, :vandalism_file, :text
    add_column :sites, :article_file, :text
    add_column :sites, :pnt_file, :text
  end
end