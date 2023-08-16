class AddArrayColumn < ActiveRecord::Migration[6.0]
  def change
    remove_column :buoys, :picture
    remove_column :buoys, :profile_picture
    remove_column :buoys, :dimension_picture
    remove_column :buoys, :mooring_picture
    remove_column :buoys, :working_cycle_picture
    add_column :buoys, :picture, :text, array: true, default: []
    add_column :buoys, :profile_picture, :text, array: true, default: []
    add_column :buoys, :dimension_picture, :text, array: true, default: []
    add_column :buoys, :mooring_picture, :text, array: true, default: []
    add_column :buoys, :working_cycle_picture, :text, array: true, default: []
  end
end
