// A series of globals to help with development
import { Alert, AsyncStorage } from 'react-native';

global.doRPC = (url, payload) => {
  return fetch(url,
  {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

global.printCompName = (comp) => {
  return comp.League.Name + ' ' + comp.League.Division + ' ' + comp.Name
}

global.getAverageStats = (stats, count) => {
  return {
  'PointsPerGame': ((stats.TwoPointFGM * 2 + stats.ThreePointFGM * 3 + stats.FreeThrowsMade) / count).toFixed(1),
  'ReboundsPerGame': ((stats.OffensiveRebounds + stats.DefensiveRebounds) / count).toFixed(1),
  'AssistsPerGame': ((stats.Assists) / count).toFixed(1),
  'BlocksPerGame': ((stats.Blocks) / count).toFixed(1),
  'StealsPerGame': ((stats.Steals) / count).toFixed(1),
  'TurnoversPerGame': ((stats.Turnovers) / count).toFixed(1),
  'MinutesPerGame': ((stats.MinutesPlayed) / count).toFixed(1),
  'TwoPointFGP': ((stats.TwoPointFGM / stats.TwoPointFGM) * 100).toFixed(1),
  'ThreePointFGP': ((stats.ThreePointFGM / stats.ThreePointFGA) * 100).toFixed(1),
  'FreeThrowPercent': ((stats.FreeThrowsMade / stats.FreeThrowsAttempted) * 100).toFixed(1),
  }
}

global.statAbbreviation = {
  'PointsPerGame': 'PPG',
  'ReboundsPerGame': 'RPG',
  'AssistsPerGame': 'APG',
  'StealsPerGame': 'SPG',
  'BlocksPerGame': 'BPG',
  'TurnoversPerGame': 'TPG',
  'MinutesPerGame': 'MPG',
  'TwoPointFGP': '2PFG',
  'ThreePointFGP': '3PFG',
  'FreeThrowPercent': 'FT'
}

global.statTrailer = {
  'PointsPerGame': ' ' + statAbbreviation['PointsPerGame'],
  'ReboundsPerGame': ' ' + statAbbreviation['ReboundsPerGame'],
  'AssistsPerGame': ' ' + statAbbreviation['AssistsPerGame'],
  'StealsPerGame': ' ' + statAbbreviation['StealsPerGame'],
  'BlocksPerGame': ' ' + statAbbreviation['BlocksPerGame'],
  'TurnoversPerGame': ' ' + statAbbreviation['TurnoversPerGame'],
  'MinutesPerGame': ' ' + statAbbreviation['MinutesPerGame'],
  'TwoPointFGP': '% ' + statAbbreviation['TwoPointFGP'],
  'ThreePointFGP': '% '+ statAbbreviation['ThreePointFGP'],
  'FreeThrowPercent': '% ' + statAbbreviation['FreeThrowPercent']
}

global.expandStats = (stats) => {
  stats.Points = (stats.TwoPointFGM * 2 + stats.ThreePointFGM * 3 + stats.FreeThrowsMade)
  stats.Rebounds = (stats.OffensiveRebounds + stats.DefensiveRebounds)
  stats.Efficiency = (
    stats.Points + 
    stats.Rebounds + 
    stats.Assists + 
    stats.Steals + 
    stats.Blocks - 
    ((stats.TwoPointFGA + stats.ThreePointFGA) - (stats.TwoPointFGM + stats.ThreePointFGM)) - 
    (stats.FreeThrowsAttempted - stats.FreeThrowsMade) 
    - stats.Turnovers)
  return stats
}

global.readFilterFromStorage = async () => {

    /* read from storage */
    filterComps = await AsyncStorage.getItem('Competitions')
    filterTeams = await AsyncStorage.getItem('Teams'); 
    filterPlayers = await AsyncStorage.getItem('Players'); 

    /* handle non-existing filters */
    filterComps = filterComps || "[]"
    filterTeams = filterTeams || "[]"
    filterPlayers = filterPlayers || "[]"

    return {
      'Competitions': JSON.parse(filterComps),
      'Teams': JSON.parse(filterTeams),
      'Players': JSON.parse(filterPlayers)
    }
}

global.storeFilterInStorage = async (comps, teams, players) => {
    console.log('storeFilterInStorage')
    try {
        await AsyncStorage.setItem('Competitions', JSON.stringify(comps));
        await AsyncStorage.setItem('Teams', JSON.stringify(teams));
        await AsyncStorage.setItem('Players', JSON.stringify(players));
      /* TODO alert */
    } catch (error) {
      /* TODO alert */
        console.log(error)
    }
}

global.getMetadata = (requestObject, callback) => {
  doRPC('https://api.heroball.app/v1/get/metadata', requestObject)
    .then((response) => response.json())
    .then((response) => {
        /* now we need to parse them and place into state */
        callback(response)
    })
    .catch((error) => {
        console.log(error)
        Alert.alert("Error loading required metadata.");
    });
}

global.serialiseMetadataToSelectItems = (metadata) => {
  items = {
          'Competitions': {
              name: 'Competitions',
              id: 0,
              children: [],
          },
          'Teams': {
              name: 'Teams',
              id: 1,
              children: [],
          },
          'Players': {
              name: 'Players',
              id: 2,
              children: [],
          }
      }

  for (var i in metadata.Competitions) {
      items.Competitions.children.push({
          name: printCompName(metadata.Competitions[i]),
          id: 'Competition_' + metadata.Competitions[i].CompetitionId,
      })
  }

  for (var i in metadata.Teams) {
      items.Teams.children.push({
          name: metadata.Teams[i].Name,
          id: 'Team_' + metadata.Teams[i].TeamId,
      })
  }

  for (var i in metadata.Players) {
      items.Players.children.push({
          name: metadata.Players[i].Name,
          id: 'Player_' + metadata.Players[i].PlayerId,
      })
  }
  return items
}

global.deserialiseSelectItemsToMetadata = (selections) => {
  competitions = []
  teams = []
  players = []

  /* we need to pull the original values out of the saved gamesFilterValues */
  for (var i in selections) {
      /* we split on the _ */
      var fields = selections[i].split('_')
      if (fields[0] === 'Competition') {
          competitions.push(fields[1])
      }
      if (fields[0] === 'Team') {
          teams.push(fields[1])
      }
      if (fields[0] === 'Player') {
          players.push(fields[1])
      }                        
  }

  return {
    'Competitions': competitions,
    'Teams': teams,
    'Players': players
  }

}