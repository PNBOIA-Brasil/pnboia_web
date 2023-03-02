class ChangeAdmin < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :admin, :user_type
    change_column :users, :user_type, :string
  end
end
