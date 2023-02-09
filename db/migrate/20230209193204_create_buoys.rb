class CreateBuoys < ActiveRecord::Migration[6.0]
  def change
    create_table :buoys do |t|
      t.integer :buoy_id
      t.integer :hull_id
      t.string :name
      t.date :deploy_date
      t.numeric :latitude
      t.numeric :longitude
      t.boolean :status
      t.string :mode
      t.string :wmo_number
      t.string :antenna_id
      t.boolean :open_data
      t.text :link_site_pnboia
      t.integer :project_id
    end
  end
end


