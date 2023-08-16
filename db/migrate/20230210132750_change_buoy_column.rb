class ChangeBuoyColumn < ActiveRecord::Migration[6.0]
  def change
    remove_column :buoys, :id
    add_index :buoys, :buoy_id
  end
end
