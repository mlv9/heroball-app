# Heroball App
A mobile application written in React-Native, and using Expo for development and testing.

## Getting Started
From the Heroball directory, run `npm install && npm start`.  Then follow the instructions to get it running on an iOS/Android device.

## Current Issues
- Missing stats from a game for a team breaks everything
- Having the same player listed for both teams in a game breaks everything
- Handle bad DNS/Certs better 

## General TODO
- Filter logis is kind of confusing in that it AND (e.g. If you select a comp and a player, its really only that player in that comp - is this intuitive?)
- Make players clickable in the stats search results
- I think the ForFilter and AGainst Filter can probably be PlayersFilter and GamesFilter

## Statistics Page
1. Select a Stats GamesFilter (Competition, Player, Team)
2. Select an 'Opposing' GamesFilter (e.g. Player A vs Team B)
3. Select a stat category to order by (e.g. PPG)

### Stats Use Cases
- Highest scoring player in a competition -> Competition B vs Competition B, order by PPG
- Highest assists player vs my team -> Competition B vs Team C, order by APG
- Which team do I score the most points against? -> Player A vs Competition B, order by PPG (same as above, not right)???
- Does this need a 'group by' as well as the 'order by'?  If it was against competition, grouped by team...

## Potential Fonts
- Heiti TC
- KohinoorTelugu-Regular
- GujaratiSangamMN
