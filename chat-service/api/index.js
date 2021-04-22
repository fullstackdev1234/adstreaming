export async function signInWithInstagram () {
  const res = await fetch(process.env.chatService.chatApiAuthInstagram, {
    method: 'GET',
    headers: {
      Accept: 'Application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true
    }
  })

  if (res.status !== 200) { return false }
  return res.json()
}
