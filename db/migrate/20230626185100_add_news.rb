class AddNews < ActiveRecord::Migration[6.0]
  def change
    create_table :news do |t|
      t.string :title
      t.string :author
      t.string :text
      t.string :picture_legend
      t.string :picture, array: true, default: []

      t.timestamps
    end
  end
end
