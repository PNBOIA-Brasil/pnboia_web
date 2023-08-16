class DropTable < ActiveRecord::Migration[6.0]
  def change
    drop_table :systems
    drop_table :new_systems
  end
end
