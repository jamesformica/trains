require 'typescript-node'
require 'colorize'

class TypescriptBuilder

  def self.build

    puts "\n### Building Typescript files ###\n".magenta

    # make sure node exists
    TypeScript::Node.check_node

    # clean out the js folder
    FileUtils.rm_rf(Dir.glob('./app/js/*'))

    # generate the js for each ts file
    error = false
    Dir.glob(File.dirname(__FILE__) + '/../app/ts/*.ts') do |tsFile|
      result = TypeScript::Node.compile_file(tsFile, '--target', 'ES5')
      if result.success?
        js_file_name = tsFile.gsub!('ts', 'js')
        out_file = File.new(js_file_name, 'w')
        out_file.puts(result.js)
        out_file.close
        puts "- #{tsFile} \t\t" + 'done'.green
      else
        puts result.stdout.red
        error = true
      end
    end

    puts "\nTypescript compilation complete.".green

    if !error
      sleep(2)
      system 'clear'
    end
  end
end