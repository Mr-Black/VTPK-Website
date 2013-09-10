URL_REGEXP = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig 

function replaceLinksInText(text)   {
  return text.replace(URL_REGEXP, '<a target="_blank" href="$1">$1</a>');
}
