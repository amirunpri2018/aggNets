library(xml2)
library(rvest)
library(curl)
library(XML)
library(jsonlite)

url <- 'http://www.soccernews.com/soccer-transfers/english-premier-league-transfers/'

web_content <- read_html(curl(url, handle = new_handle("useragent" = "Mozilla/5.0")))

table <- data.frame(position = html_text(html_nodes(html_nodes(web_content, '.player'),'span')), stringsAsFactors=FALSE)

player <- html_text(html_nodes(web_content, '.player'))
pos <- unique(table$position)
for(i in 1:length(pos)){
  player <- gsub(pos[i], '', player)
}
player <- player[2:length(player)]

country <- html_text(html_nodes(web_content, '.country'))
country <- country[2:length(country)]

to <- html_text(html_nodes(web_content, '.to'))
to <- to[2:length(to)]

from <- html_text(html_nodes(web_content, '.from'))
from <- from[2:length(from)]

price <- html_text(html_nodes(web_content, '.price'))
price <- price[2:length(price)]

price <- gsub('million', '',price)

table <- cbind(player, table, to, from, price, stringsAsFactors=FALSE)

colnames(table) <- c('player','position','source','target','value')

teams <- data.frame(id=unique(c(table$to, table$from)))
                                                                                                                             
links <- toJSON(unname(split(table[2:5], 1:nrow(table))))
nodes <- toJSON(unname(split(teams, 1:nrow(teams))))

write(links, 'links.json')
write(nodes, 'nodes.json')
