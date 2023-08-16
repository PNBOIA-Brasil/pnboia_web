class AddColumnsTo < ActiveRecord::Migration[6.0]
  def change
    add_column :buoys, :manufacturer, :text
    add_column :buoys, :model, :string
    add_column :buoys, :diameter, :numeric
    add_column :buoys, :weight, :numeric
    add_column :buoys, :depth, :numeric
    add_column :buoys, :sensor_description, :text
    add_column :buoys, :working_cycle, :text
    add_column :buoys, :observation, :text
  end
end
