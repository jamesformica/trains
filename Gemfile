# The list of required Gems to run the web application
# Is better to specify version numbers but in this case we will just take the latest

source 'https://rubygems.org'

# Need to get the latest (1.4.6) Sinatra from git to resolve a bug
# Bug: https://gist.github.com/celsoMartins/9b9935c07eaaa334d346
# Fixing Commit: https://github.com/sinatra/sinatra/commit/b39d72d2a5b824b5f607b7825c4b076f527461a1

gem 'sinatra', '1.4.6', :github => "sinatra/sinatra"

gem 'sinatra-assetpack', '0.3.3', :require => 'sinatra/assetpack'

gem 'sass', '3.4.13'

gem 'slim', '3.0.3'

gem 'sinatra-contrib', '1.4.2'

gem 'sinatra-activerecord', '2.0.4'

gem 'sinatra-active-model-serializers', '0.0.2'

gem 'rake', '10.4.2'

gem 'typescript-src', '~> 1.4.1'

gem 'colorize', '0.7.7'

group :development, :test do
	gem 'sqlite3', '1.3.10'
end

group :test do
  gem 'rspec', '3.2.0'
  gem 'rack-test', '0.6.3'
  gem 'database_cleaner', '1.4.1'
end

group :production do
	gem 'pg', '0.18.1'
end