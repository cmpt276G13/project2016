# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

#precompile the page specific javascript
Rails.application.config.assets.precompile += %w(battleState.js)
Rails.application.config.assets.precompile += %w(bootState.js)
Rails.application.config.assets.precompile += %w(overworldState.js)
Rails.application.config.assets.precompile += %w(stateManager.js)
Rails.application.config.assets.precompile += %w(objectHighlighter.js)
Rails.application.config.assets.precompile += %w(rpgEntity.js)
Rails.application.config.assets.precompile += %w(textbox.js)
Rails.application.config.assets.precompile += %w(actionDisplay.js)
Rails.application.config.assets.precompile += %w(battleSubstateFunctions.js)
Rails.application.config.assets.precompile += %w(overworldSubstateFunctions.js)
Rails.application.config.assets.precompile += %w(screenTransitionEffects.js)
Rails.application.config.assets.precompile += %w(pauseMenuState.js)
Rails.application.config.assets.precompile += %w(pauseMenuSubstateFunctions.js)
Rails.application.config.assets.precompile += %w(textDisplay.js)
Rails.application.config.assets.precompile += %w(items.js)