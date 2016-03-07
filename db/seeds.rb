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

q_orc1 = Quest.create!(name: "Kill Quest!",
              description: "Kill 5 Orcs.\n
                            The Orcs have been terrorizing the village for several decades. Any Orcs you kill will be much appreciated.",
              level_req: 1)
q_orc2 = Quest.create!(name: "Orc Killer",
              description: "Kill 10 Orcs.\n
                            Please continue to kill the Orcs. You will be handsomely rewarded.",
              level_req: 1)
q_orc2.quests << q_orc1