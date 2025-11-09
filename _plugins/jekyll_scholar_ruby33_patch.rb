# _plugins/jekyll_scholar_ruby33_patch.rb
# Fix for Ruby 3.3 where File.exists? was removed
module FileExistsPatch
  def exists?(path)
    File.exist?(path)
  end
end

class << File
  prepend FileExistsPatch
end
