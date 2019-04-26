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

global.getAverageStats = (stats, count) => {

  ppg = ((stats.TwoPointFGM * 2 + stats.ThreePointFGM * 3 + stats.FreeThrowsMade) / count).toFixed(1)

  return {
    'PointsPerGame': ppg
  }
}