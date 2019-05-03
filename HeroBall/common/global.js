// A series of globals to help with development

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