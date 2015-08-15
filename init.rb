require_relative "helpers/container_helper"
require_relative "build/build_js"

Trains.helpers ContainerHelpers

# compile the typescript on app startup
TypescriptBuilder.build