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
  'MinutesPerGame': ((stats.Minutes) / count).toFixed(1),
  'TwoPointFGP': Math.round((stats.TwoPointFGM / stats.TwoPointFGM) * 100),
  'ThreePointFGP': Math.round((stats.ThreePointFGM / stats.ThreePointFMA) * 100),
  'FreeThrowPercent': Math.round((stats.FreeThrowsMade / stats.FreeThrowsAttempted) * 100),
  }
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