// A series of globals to help with development
import { Alert, AsyncStorage } from 'react-native';

global.doRPC = (url, payload) => {
  return fetch("https://api.heroball.xyz/" + url,
  {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    if(response.ok !== true) {
        console.log(response)
        throw "grpc-error: " + response.error
    }
    return response
    }
  )
}

global.printCompName = (comp) => {
  return comp.League.Name + ' ' + comp.League.Division + ' ' + comp.Name
}

global.getAverageStats = (stats) => {
  return {
  'PPG': ((stats.TwoPointFGM * 2 + stats.ThreePointFGM * 3 + stats.FreeThrowsMade) / stats.GameCount).toFixed(1),
  'RPG': ((stats.OffensiveRebounds + stats.DefensiveRebounds) / stats.GameCount).toFixed(1),
  'APG': ((stats.Assists) / stats.GameCount).toFixed(1),
  'BPG': ((stats.Blocks) / stats.GameCount).toFixed(1),
  'SPG': ((stats.Steals) / stats.GameCount).toFixed(1),
  'TPG': ((stats.Turnovers) / stats.GameCount).toFixed(1),
  'MPG': ((stats.MinutesPlayed) / stats.GameCount).toFixed(1),
  '2PFG': ((stats.TwoPointFGM / ((stats.TwoPointFGA > 0) ? stats.TwoPointFGA : 1)) * 100).toFixed(1),
  '3PFG': ((stats.ThreePointFGM / ((stats.ThreePointFGA > 0) ? stats.ThreePointFGA : 1)) * 100).toFixed(1),
  'FT': ((stats.FreeThrowsMade / ((stats.FreeThrowsAttempted > 0) ? stats.FreeThrowsAttempted : 1)) * 100).toFixed(1),
  }
}

global.getStatFriendlyName = (statAbbreviation) => {
    map = {
    'PPG': 'Points Per Game',
    'RPG': 'Rebounds Per Game',
    'APG': 'Assists Per Game',
    'SPG': 'Steals Per Game',
    'BPG': 'Blocks Per Game',
    'TPG': 'Turnovers Per Game',
    'MPG': 'Minutes Per Game',
    '2PFG': 'Two Point FG%',
    '3PFG': 'Three Point FG%',
    'FT': 'Free Throw %',
    'EFF': 'Efficiency'
  }

  return map[statAbbreviation]
}  

global.getStatTrailer = (statAbbreviation) => {

    if (statAbbreviation === '2PFG' || statAbbreviation === '3PFG' || statAbbreviation === 'FT') {
        return '% ' + statAbbreviation
    }
    return ' ' + statAbbreviation
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

    console.log(filterTeams)

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
  doRPC('v1/get/metadata', requestObject)
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
          type: 'Competition',
      })
  }

  for (var i in metadata.Teams) {
      items.Teams.children.push({
          name: metadata.Teams[i].Name,
          id: 'Team_' + metadata.Teams[i].TeamId,
          type: 'Team',
      })
  }

  for (var i in metadata.Players) {
      items.Players.children.push({
          name: metadata.Players[i].Name,
          id: 'Player_' + metadata.Players[i].PlayerId,
          type: 'Player',
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