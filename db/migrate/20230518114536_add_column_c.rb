class AddColumnC < ActiveRecord::Migration[6.0]
  def change
    remove_column :sites, :other_pictures
    add_column :sites, :other_picture, :text, array: true, default: []
  end
end
