export function getTokenFromCookie(TokenName:string) {
  document.cookie.split(';').forEach(cookie => {    const [name, value] = cookie.trim().split('=')
    if (name === TokenName) {
      console.log('Token found:', value)
      return value
    }
  })
  return null
}
