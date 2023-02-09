# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_02_09_212611) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "buoys", force: :cascade do |t|
    t.integer "buoy_id"
    t.integer "hull_id"
    t.string "name"
    t.date "deploy_date"
    t.decimal "latitude"
    t.decimal "longitude"
    t.boolean "status"
    t.string "mode"
    t.string "wmo_number"
    t.string "antenna_id"
    t.boolean "open_data"
    t.text "link_site_pnboia"
    t.integer "project_id"
    t.text "manufacturer"
    t.string "model"
    t.decimal "diameter"
    t.decimal "weight"
    t.decimal "depth"
    t.text "sensor_description"
    t.text "working_cycle"
    t.text "observation"
    t.text "picture"
    t.text "profile_picture"
    t.text "dimension_picture"
    t.text "mooring_picture"
    t.text "working_cycle_picture"
  end

  create_table "sites", force: :cascade do |t|
    t.text "about"
    t.text "history"
    t.text "institution"
    t.text "goal"
    t.text "problem"
    t.text "observation"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "picture"
    t.text "quality_control_file"
    t.text "vandalism_file"
    t.text "article_file"
    t.text "pnt_file"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "username"
    t.boolean "admin"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
end
