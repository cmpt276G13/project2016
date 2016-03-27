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

ActiveRecord::Schema.define(version: 20160321010847) do

  create_table "places", force: :cascade do |t|
    t.float    "latitude"
    t.float    "longitude"
    t.string   "address"
    t.string   "title"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "players", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "health",                   default: 50
    t.integer  "strength",                 default: 10
    t.integer  "defense",                  default: 10
    t.integer  "level",                    default: 1
    t.integer  "experience",               default: 0
    t.integer  "gold",                     default: 0
    t.datetime "created_at",                                                                    null: false
    t.datetime "updated_at",                                                                    null: false
    t.integer  "max_health",               default: 50
    t.integer  "experience_to_next_level", default: 10
    t.integer  "deaths",                   default: 0
    t.text     "items",                    default: "---\nSmall Potion: 2\nMedium Potion: 2\n"
    t.text     "skills",                   default: "---\n- Slash\n- Fireball\n"
    t.integer  "mana",                     default: 25
    t.integer  "max_mana",                 default: 25
    t.integer  "magic_power",              default: 10
    t.integer  "magic_defense",            default: 10
  end

  add_index "players", ["user_id"], name: "index_players_on_user_id"

  create_table "quest_acceptances", force: :cascade do |t|
    t.integer  "player_id"
    t.integer  "quest_id"
    t.boolean  "completed",  default: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.boolean  "turned_in"
    t.text     "progress",   default: "--- {}\n"
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

  create_table "quests", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "level_req"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.text     "rewards",     default: "--- {}\n"
    t.string   "type"
    t.text     "target",      default: "--- {}\n"
  end

  add_index "quests", ["name"], name: "index_quests_on_name", unique: true

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
