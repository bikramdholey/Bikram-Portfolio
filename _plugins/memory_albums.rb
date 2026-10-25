# frozen_string_literal: true

# Creates one album page per folder in assets/img/memories/, so a new album only
# needs its photos uploaded. Each page uses the "trip" layout and lives at
# /memories/<folder>-trip/.
module MemoryAlbums
  class AlbumPage < Jekyll::PageWithoutAFile
    def initialize(site, folder)
      super(site, site.source, File.join("memories", "#{folder}-trip"), "index.html")
      entry = Array(site.data["memory_albums"]).find { |a| a.is_a?(Hash) && a["folder"].to_s == folder }
      data["layout"] = "trip"
      data["title"] = entry && !entry["title"].to_s.empty? ? entry["title"] : folder
      data["folder"] = folder
      data["permalink"] = "/memories/#{folder}-trip/"
    end
  end

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      root = File.join(site.source, "assets", "img", "memories")
      return unless Dir.exist?(root)

      Dir.children(root).sort.each do |folder|
        next if folder.start_with?(".") || !File.directory?(File.join(root, folder))

        site.pages << AlbumPage.new(site, folder)
      end
    end
  end
end
