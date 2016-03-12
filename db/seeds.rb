# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
# --------------------------------------------------------------------------
# Create our Admin accounts with generic passwords and usernames.
# Then, we log in and change our respective passwords and usernames.
# Could also do the same with email, if you don't want your email be posted here.
# This repository is going to be public on github, so this would be a necessary security measure.

# 5.times do |n|
#   User.create!(username:  "admin#{n+1}",
#               email: "example#{n+1}@railstutorial.org",
#               password:              "foobar",
#               password_confirmation: "foobar",
#               admin: true).create_player
# end

# Unnecessary. We can give admin priviledges through the rails console.

# --------------------------------------------------------------------
# Sample data. Uncomment below to use.
# User.create!(username:  "Example User",
#             email: "example@railstutorial.org",
#             password:              "foobar",
#             password_confirmation: "foobar",
#             admin: true).create_player

# 99.times do |n|
#   username  = Faker::Name.name
#   email = "example-#{n+1}@railstutorial.org"
#   password = "password"
#   User.create!(username:  username,
#               email: email,
#               password:              password,
#               password_confirmation: password).create_player
# end

# Could use the gem populate in order to populate the db instead of seeding.
# Could use the gem migration_data in order to squash migrations and/or populate.

q_orc1 = KillQuest.new(name: "Kill Quest!",
              description: "Kill 5 Orcs\nThe Orcs have been terrorizing the village for several decades. Any Orcs you kill will be much appreciated.",
              level_req: 1)
q_orc1.rewards[:items] = { "Small Potion": "1" }
q_orc1.rewards[:stats] = { experience: 30, gold: 100 }
q_orc1.target[:orc] = 5
q_orc1.save

q_orc2 = KillQuest.new(name: "Orc Killer",
              description: "Kill 10 Orcs\nPlease continue to kill the Orcs. You will be handsomely rewarded.",
              level_req: 2)
q_orc2.rewards[:items] = { "Small Potion": 3 }
q_orc2.rewards[:stats] = { experience: 50, gold: 120 }
q_orc2.target[:orc] = 10
q_orc2.quests << q_orc1 # Make q_orc1 a requirement for q_orc2
q_orc2.save

q_s_potion = GatherQuest.new(name: "Gather Quest!",
                                  description: "Gather 3 Small Potions\nI have discovered a new brewing method! I can take Small Potions and increase their potency. Please gather some.",
                                  level_req: 1)
q_s_potion.rewards[:items] = { "Small Potion": 4, "Medium Potion": 2 }
q_s_potion.rewards[:stats] = { experience: 30, gold: 50 }
q_s_potion.target["Small Potion"] = 3
q_s_potion.save