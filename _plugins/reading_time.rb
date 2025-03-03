module ReadingTimeFilter
  def reading_time(input)
    words_per_minute = 200
    words = input.split.size
    minutes = (words / words_per_minute).ceil
    minutes
  end
end

Liquid::Template.register_filter(ReadingTimeFilter)