import Cookie from 'js-cookie'
import randomColor from 'randomcolor'
export const state = () => ({
  auth: []
})
export const mutations = {
  setAuth (state, authDetails) {
    try {
      state.auth = authDetails
    } catch (error) {
      throw new Error(`LOGIN MUTATE ${error}`)
    }
  }
}
export const actions = {
  async loginUser ({ commit }, user) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: user.username,
          password: user.password
        })
      })
        .then(res => res.json())
        .then((login) => {
          const auth = {
            token: login.jwt,
            ...login.user,
            color: randomColor()
          }
          commit('setAuth', auth)
          Cookie.set('auth', auth)
          window.location.href = '/'
        })
    } catch (error) {
      throw new Error(`LOGIN ACTION ${error}`)
    }
  },
  createUser ({ commit }, user) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}auth/local/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: user.username,
            email: user.email,
            password: user.password
          })
        })
          .then(res => res.json())
          .then((register) => {
            resolve(register)
            // window.location.href = '/login?register=true'
          })
      })
    } catch (error) {
      throw new Error(`LOGIN ACTION ${error}`)
    }
  }
}
