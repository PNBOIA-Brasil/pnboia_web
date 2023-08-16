class AddColumn < ActiveRecord::Migration[6.0]
  def change
    add_column :sites, :other_pictures, :text, array: true, default: []
    add_column :buoys, :dimension_description, :text
    add_column :buoys, :mooring_description, :text
  end
end
