class AddTokenToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :authentication_token, :string, limit: 20
    add_index :users, :authentication_token, unique: true
  end
end
