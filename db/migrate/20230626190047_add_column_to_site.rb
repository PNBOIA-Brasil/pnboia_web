class AddColumnToSite < ActiveRecord::Migration[6.0]
  def change
    rename_column :sites, :about, :about1
    add_column :sites, :about2, :text
    add_column :sites, :about3, :text
  end
end
