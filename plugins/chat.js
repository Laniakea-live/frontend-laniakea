export default (_, inject) => {
  inject('sendWS', payload => sendWS(payload))
}

function sendWS (payload) {
  const formattedMessage = {
    message: null,
    user: null,
    date: Date.now()
  }
  formattedMessage.message = payload.message
  formattedMessage.user = payload.user
  return formattedMessage
}
