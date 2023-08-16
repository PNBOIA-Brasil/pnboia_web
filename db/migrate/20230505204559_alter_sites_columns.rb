class AlterSitesColumns < ActiveRecord::Migration[6.0]
  def change
    remove_column :sites, :picture
    remove_column :sites, :quality_control_file
    remove_column :sites, :vandalism_file
    remove_column :sites, :article_file
    remove_column :sites, :pnt_file
    add_column :sites, :picture, :text, array: true, default: []
    add_column :sites, :quality_control_file, :text, array: true, default: []
    add_column :sites, :vandalism_file, :text, array: true, default: []
    add_column :sites, :article_file, :text, array: true, default: []
    add_column :sites, :pnt_file, :text, array: true, default: []
  end
end