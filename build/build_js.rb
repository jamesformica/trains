require 'typescript-src'
require 'open3'
require 'colorize'

class TypescriptBuilder

  def self.build

    puts "\n### Building Typescript files ###\n".magenta

    # clean out the js folder
    FileUtils.rm_rf(Dir.glob('./app/js/*'))

    # generate the js for each ts file
    error = false
    Dir.glob(File.dirname(__FILE__) + '/../app/ts/*.ts') do |tsFile|
      result = compile_file(tsFile, File.dirname(__FILE__) + '/../app/js')
      if result.success?
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

  def self.compile_file(source_file, output_dir)
    stdout, stderr, exit_status = tsc('--outDir', output_dir, source_file)
    CompileResult.new(exit_status, stdout, stderr)
  end

  def self.tsc(*args)
    cmd = [node, TypeScript::Src.tsc_path.to_s, *args]
    Open3.capture3(*cmd)
  end

  def self.node
    ENV['TS_NODE'] || 'node'
  end
end

class CompileResult

  def initialize(exit_status, stdout, stderr)
    @exit_status = exit_status
    @stdout = stdout
    @stderr = stderr
  end

  attr_reader :exit_status, :stdout, :stderr

  def success?
    @exit_status == 0
  end

end


