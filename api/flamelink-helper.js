import fs from 'fs'
import { parse } from 'url'
import crypto from 'crypto'
import https from 'https'
import admin from 'firebase-admin'
import flamelink from 'flamelink/app'
import 'flamelink/content'
import 'flamelink/storage'

const FIREBASE_CONFIG = require('../omnis-player-firebase-adminsdk-zazip-e108da0481.json')
const FLAMELINK_STORAGE_BUCKET = 'omnis-player.appspot.com'
const SET_ONLY = process.env.SET_ONLY === 'true'

const fsp = fs.promises

/* List all the datatypes that we allow */
const allowedTypes = [
  'boolean',
  'color',
  'date',
  'datetime-local',
  'markdown-editor',
  'number',
  'select',
  'switch',
  'text',
  'textarea',
  // Special types
  'media',
  'select-relational'
]

/**
 * Get all the field information of a specific schema
 *
 * @param   {object}  schema - schema list
 * @param   {string}  schemaName
 * @return  {object}  { fields: [string], subFields: {} }
 */
const processSchema = (schemas, schemaName) => {
  const { fields } = schemas[schemaName]

  // Add the `id` field by default, because it is not included
  // in the flamelink schema
  const schemaFields = [ 'id' ]
  const schemaSubFields = []
  fields.forEach(field => {
    if (allowedTypes.includes(field.type)) {
      schemaFields.push(field.key)

      // Handle special types
      // Process references to other schemas
      if (field.type === 'select-relational') {
        schemaSubFields.push({
          field: field.key,
          fields: [ 'id' ],
          ref: field.relation
        })
      }
      // Process images
      else if (field.type === 'media') {
        schemaSubFields.push({
          field: field.key,
          fields: [ 'url' ],
          $image: true
        })
      }
    } else {
      console.log(`Unknown type: ${field.type}`)
    }
  })

  return {
    fields: schemaFields,
    subFields: schemaSubFields
  }
}

/**
 * Prepare all the schemas
 *
 * @param   {object}  db - flamelink DB
 * @return  {object}
 */
const prepareSchemas = async db => {
  const schemaDefinitions = {}
  const schemas = await db.schemas.get()
  for (const key in schemas) {
    schemaDefinitions[key] = processSchema(schemas, key)
  }

  for (const key in schemaDefinitions) {
    const schema = schemaDefinitions[key]
    schema.populate = schema.subFields.map(sub => {
      if (sub.ref) {
        const ref = schemaDefinitions[sub.ref]
        delete sub.ref

        sub.fields = [ 'id' ]
      } else if (sub.$image) {
        delete sub.$image
        if (schema.imageFields == null) schema.imageFields = []
        schema.imageFields.push(sub.field)
      }

      return sub
    })
  }

  return schemaDefinitions
}

const downloadImage = url => {
  const parsed = parse(url, true)
  const extension = /\.(jpe?g|png|gif)$/i.exec(parsed.pathname)
  if (extension == null) {
    console.warn(`Unknown file extension: ${parsed.pathname}`)
    return
  }

  const hash = crypto.createHash('sha256').update(parsed.pathname).digest('hex')
  const filename = `${hash}${extension[0].toLowerCase()}`
  const filepath = `./assets/content/${filename}`

  return new Promise(done => {
    if (fs.existsSync(filepath)) return done(filename)
    console.log(`Downloading: ${url}`)

    const file = fs.createWriteStream(filepath)
    const request = https.get(url, response => {
      response.pipe(file)
      file.on('finish', () => {
        file.close(() => done(filename))
      })
    }).on('error', err => {
      console.error(err.message)
      fs.unlink(() => done())
    })
  })
}

const downloadImages = async (data, fields) => {
  for (const field of fields) {
    if (Array.isArray(data[field]) && data[field].length) {
      const filename = await downloadImage(data[field][0].url)
      data[field] = filename == null ? '' : filename
    }
  }
}

/**
 * Get all the data for a specific schema
 *
 * @param   {object}  db - flamelink DB
 * @param   {object}  schemaDefinitions
 * @param   {=> string}  schema - name of the schema
 * @return  {object}
 */
const getData = (db, schemaDefinitions) => async schema => {
  const data = await db.content.get({
    schemaKey: schema,
    ...schemaDefinitions[schema]
  })

  // Single schema
  if (data.setLive) {
    if (schemaDefinitions[schema].imageFields) {
      await downloadImages(data, schemaDefinitions[schema].imageFields)
    }
    return data
  }

  const ret = {}
  for (const id in data) {
    const d = data[id]
    if (SET_ONLY && d.setLive !== true) {
      continue
    }

    if (schemaDefinitions[schema].imageFields) {
      await downloadImages(d, schemaDefinitions[schema].imageFields)
    }

    ret[d.id] = d
  }

  return ret
}

const prepareData = async db => {
  const schemaDefinitions = await prepareSchemas(db)
  const prep = getData(db, schemaDefinitions)

  const ret = {}
  for (const key in schemaDefinitions) {
    ret[key] = await prep(key)
  }

  return ret
}

export default async () => {
  let firebaseApp

  if ( ! admin.apps.length) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_CONFIG),
      storageBucket: FLAMELINK_STORAGE_BUCKET
    })
  } else {
    firebaseApp = admin.app()
  }

  try {
    return require('../data.json')
  } catch {
    console.warn(`Data not found, downloading...`)

    const db = await flamelink({
      firebaseApp,
      dbType: 'cf',
      env: 'staging'
    })

    const data = await prepareData(db)
    await fsp.writeFile('./data.json', JSON.stringify(data))
    return data
  }
}
