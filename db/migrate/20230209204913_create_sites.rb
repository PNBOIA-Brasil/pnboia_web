class CreateSites < ActiveRecord::Migration[6.0]
  def change
    create_table :sites do |t|
      t.text :about
      t.text :history
      t.text :institution
      t.text :goal
      t.text :problem
      t.text :observation
      t.timestamps
    end
  end
end
