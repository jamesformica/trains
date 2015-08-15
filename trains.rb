require 'sinatra'
require 'sinatra/base'
require 'sinatra/json'
require 'sinatra/assetpack'
require 'sinatra/activerecord'
require 'sinatra/reloader'
require 'active_model_serializers'
require 'sinatra_active_model_serializers'
require 'slim'
require 'sass'

class Trains < Sinatra::Base

  set :sessions => true
  set :root, File.dirname(__FILE__)
  set :public_folder, File.dirname(__FILE__) + '/app/'

  configure :development do
    register Sinatra::Reloader
    disable :show_exceptions
  end

  register Sinatra::AssetPack

  # ASSET CONFIGURATION - define the assets that will be accessible #
  assets do

    js_compression :jsmin
    css_compression :sass

    # define js variable to contain the collated and minified javascript files
    js :main, '/js/main.js', [
                '/js/*.js'
            ]

    # define a css variable to contain the converted and minified css files
    css :main, [
                 '/css/*.css'
             ]

    css :vendor, [
                   '/css/vendor/**/*.css'
               ]

  end

  # Helpers #
  require_relative 'init'

  # ROUTES #
  get '/' do
    slim :index
  end

  get '/play' do
    slim :play
  end

end