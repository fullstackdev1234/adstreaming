export default (context, inject) => {
  inject('api', async (key, search) => {
    let opts = {}
    if (search != null) {
      opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(search)
      }
    }
    const body = await fetch(`${process.server ? process.env.INTERNAL_URL : 'http://localhost/'}api/${key}`, opts)

    return body.json()
  })
}
