/**
 * Send a response helper
 *
 * @param  {object}  res - nodejs response object
 * @param  {mixed}   content - string, object, number to send as a response
 * @param  {int}     [code=200] - HTTP status code
 */
export const send = (res, content, code = 200) => {
  res.statusCode = code
  res.setHeader('Access-Control-Allow-Origin', '*')

  let str = content == null ? '' : content

  if (['boolean', 'number', 'object'].includes(typeof str)) {
    // We stringify before setting the header
    // in case `JSON.stringify` throws and a
    // 500 has to be sent instead

    try {
      str = JSON.stringify(str)
    } catch (e) {
      return send(res, e.stack, 500)
    }

    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
    }
  } else if (!res.getHeader('Content-Type')) {
    const type = /^\s*</.test(str) ? 'html' : 'plain'
    res.setHeader('Content-Type', `text/${type}; charset=utf-8`)
  }

  res.setHeader('Content-Length', Buffer.byteLength(str))
  res.end(str)
}
