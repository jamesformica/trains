module ContainerHelpers
  def container(js_function, &block)

    raise "container must be in block" unless block_given?

    @js_function = js_function
    slim :"helpers/container", layout: false do
      block.yield
    end
  end
end
