import slugify from '@sindresorhus/slugify'
import getData from './flamelink-helper.js'
import { send } from './utils.js'

const slugs = {
  legal: [ 'type' ]
}

const relations = {
  homePage: [
    { keys: ['highlightedVideos'], schema: 'videos' },
    { keys: ['highlightedVideos', 'artists'], schema: 'artists' },
    { keys: ['featuredVideos'], schema: 'videos' },
    { keys: ['featuredVideos', 'artists'], schema: 'artists' },
    { keys: ['mostPopularVideos'], schema: 'videos' },
    { keys: ['mostPopularVideos', 'artists'], schema: 'artists' },
    { keys: ['mustWatchVideos'], schema: 'videos' },
    { keys: ['mustWatchVideos', 'artists'], schema: 'artists' }
  ],

  event: [
    { keys: ['artists'], schema: 'artists' },
    { keys: ['video'], schema: 'videos' }
  ],

  merch: [
    { keys: ['artists'], schema: 'artists' }
  ],

  series: [
    { keys: ['heroVideo'], schema: 'videos' },
    { keys: ['eventLineup'], schema: 'event' },
    { keys: ['eventLineup', 'artists'], schema: 'artists' },
    { keys: ['previousShows'], schema: 'videos' },
    { keys: ['previousShows', 'artists'], schema: 'artists' },
    { keys: ['featuredClips'], schema: 'videos' },
    { keys: ['featuredClips', 'artists'], schema: 'artists' }
  ],

  videos: [
    { keys: ['artists'], schema: 'artists' },
    { keys: ['youMightLikeVideos'], schema: 'videos' },
    { keys: ['youMightLikeVideos', 'artists'], schema: 'artists' },
    { keys: ['nextVideo'], schema: 'videos' },
    { keys: ['nextVideo', 'artists'], schema: 'artists' }
  ]
}

const findData = (allData, schema, keys) => {
  const data = allData[schema]
  let ret = {}
  if (keys == null) return ret

  if (Array.isArray(keys)) {
    ret = []
    for (const key of keys) {
      if (data.hasOwnProperty(key.id)) {
        ret.push(data[key.id])
      }
    }
  } else if (data.hasOwnProperty(keys.id)) {
    ret = data[keys.id]
  }

  return ret
}

const populateRelations = (allData, data, relations) => {
  if (Array.isArray(data)) {
    for (const key in data) {
      // Fill single items
      data[key] = populateRelations(allData, data[key], relations)
    }
  } else {
    // Fill multiple items
    for (let { keys, schema } of relations) {
      const currentKey = keys.slice(0, 1)
      if (keys.length === 1) {
        data[currentKey] = findData(allData, schema, data[currentKey])
      } else {
        data[currentKey] = populateRelations(allData, data[currentKey], [{ keys: keys.slice(1), schema }])
      }
    }
  }

  return data
}

export default async (req, res) => {
  const key = req.url.replace(/^\//, '')
  const data = await getData()

  let dataToSend = JSON.parse(JSON.stringify(data[key]))
  if ( ! dataToSend.hasOwnProperty('setLive')) dataToSend = Object.values(dataToSend)

  if (relations[key]) {
    dataToSend = populateRelations(data, dataToSend, relations[key])
  }

  // Set up the artificial slugs
  if (slugs.hasOwnProperty(key)) {
    for (const dataKey in dataToSend) {
      for (const slug of slugs[key]) {
        dataToSend[dataKey][`${slug}_slug`] = slugify(dataToSend[dataKey][slug])
      }
    }
  }


  send(res, dataToSend)
}
