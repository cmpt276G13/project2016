# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

<<<<<<< HEAD
ActiveRecord::Schema.define(version: 20160306233331) do
=======
ActiveRecord::Schema.define(version: 20160307013037) do

  create_table "places", force: :cascade do |t|
    t.float    "latitude"
    t.float    "longitude"
    t.string   "address"
    t.string   "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end
>>>>>>> 6f78558c8f2e6e8b4cb5c4688a2fb2b43fc478c0

  create_table "players", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "health",                   default: 50
    t.integer  "strength",                 default: 10
    t.integer  "defense",                  default: 10
    t.integer  "level",                    default: 1
    t.integer  "experience",               default: 0
    t.integer  "gold",                     default: 0
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.integer  "max_health",               default: 50
    t.integer  "experience_to_next_level", default: 10
    t.integer  "deaths",                   default: 0
<<<<<<< HEAD
    t.text     "items",                    default: "--- {}\n"
=======
    t.text     "items"
    t.text     "ongoing_quests"
    t.text     "completed_quests"
>>>>>>> 6f78558c8f2e6e8b4cb5c4688a2fb2b43fc478c0
  end

  add_index "players", ["user_id"], name: "index_players_on_user_id"

  create_table "quest_acceptances", force: :cascade do |t|
    t.integer  "player_id"
    t.integer  "quest_id"
    t.boolean  "completed",  default: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "quest_acceptances", ["player_id", "quest_id"], name: "index_quest_acceptances_on_player_id_and_quest_id", unique: true
  add_index "quest_acceptances", ["player_id"], name: "index_quest_acceptances_on_player_id"
  add_index "quest_acceptances", ["quest_id", "completed"], name: "index_quest_acceptances_on_quest_id_and_completed"
  add_index "quest_acceptances", ["quest_id"], name: "index_quest_acceptances_on_quest_id"

  create_table "quest_pre_requisites", force: :cascade do |t|
    t.integer  "quest_parent_id", null: false
    t.integer  "quest_child_id",  null: false
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

# Could not dump table "quests" because of following NoMethodError
#   undefined method `[]' for nil:NilClass

  create_table "users", force: :cascade do |t|
    t.string   "username"
    t.string   "email"
    t.string   "password_digest"
    t.boolean  "admin",           default: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "remember_digest"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["username"], name: "index_users_on_username", unique: true

end
