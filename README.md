# Issues
- Missing stats from a game for a team breaks everything
- Having the same player listed for both teams in a game breaks everything

# TODO
- pb.Competition should include total games played, and first and last game played (TO DATE) in that comp
- Filter logis is kind of confusing in that it AND (e.g. If you select a comp and a player, its really only that player in that comp - is this intuitive?)

# Statistics Page
1. Select a Stats GamesFilter (Competition, Player, Team)
2. Select an 'Opposing' GamesFilter (e.g. Player A vs Team B)
3. Select a stat category to order by (e.g. PPG)

## Use Cases
- Highest scoring player in a competition -> Competition B vs Competition B, order by PPG
- Highest assists player vs my team -> Competition B vs Team C, order by APG
- Which team do I score the most points against? -> Player A vs Competition B, order by PPG (same as above, not right)???

Limit To
- Competition
- Team
- Player

Stats Against
- Competition
- Team

Order By

Group By
Team?