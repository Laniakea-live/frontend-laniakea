<template>
  <div
    id="container"
    style="width:100%;min-width:300px;"
  >
    <MainUserList :onlineusers="onlineUsers" />
    <vue-plyr ref="plyr" :options="$store.state.sessionHandler.role === 'host' ? optionsHost : optionsParticipant">
      <video
        ref="video"
        playsinline
        :controls="false"
        :clickToPlay="true"
        style="--plyr-color-main: #9c27b0;"
        :src="$store.state.sessionHandler.blobURL"
        :current-time.prop="$store.state.sessionHandler.role === 'participant' ? time : null"
        @play="$store.state.sessionHandler.role === 'host' ? (socket.emit('play'), socket.emit('seekTo', $event.target.currentTime), socket.emit('chat', $sendWS({
          message: $store.state.auth.username + ' ' + $t('session.resume'),
          user: {
            name: '',
            color: '#ffffff'
          }
        }))) : null"
        @pause="$store.state.sessionHandler.role === 'host' ? (socket.emit('pause'), socket.emit('seekTo', $event.target.currentTime), socket.emit('chat', $sendWS({
          message: $store.state.auth.username + ' ' + $t('session.pause'),
          user: {
            name: '',
            color: '#ffffff'
          }
        }))) : null"
        @seeking="$store.state.sessionHandler.role === 'host' ? socket.emit('seekTo', $event.target.currentTime) : null"
      />
    </vue-plyr>
    <MainChat
      :chatmessages="chatMessages"
      :onlineusers="onlineUsers"
      @chat="chat($event)"
      @closeSession="closeSession()"
    />
  </div>
</template>

<script>
import { nanoid } from 'nanoid'
export default {
  name: 'Player',
  data () {
    return {
      optionsHost: {
        controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'airplay', 'fullscreen'],
        fullscreen: {
          enabled: true,
          container: '#container'
        },
        clickToPlay: false
      },
      optionsParticipant: {
        controls: ['current-time', 'duration', 'mute', 'volume', 'airplay', 'fullscreen'],
        fullscreen: {
          enabled: true,
          container: '#container'
        },
        clickToPlay: false,
        keyboard: false
      },
      video: null,
      uniqueid: '',
      time: 0,
      ws: null,
      socket: null,
      chatMessages: [],
      onlineUsers: []
    }
  },
  computed: {
    hasFocus () {
      return document.hasFocus()
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.closeSession)
    this.setupSocket()
  },
  methods: {
    setupSocket () {
      const { io } = require('socket.io-client')
      const SERVER_URL = this.$config.WS_ENDPOINT
      this.socket = io(SERVER_URL, { auth: this.$store.state.auth })

      this.socket.emit('joinRoom', this.uniqueid)
      const formattedMessage = this.$sendWS({
        message: this.$store.state.auth.username + ' ' + this.$t('session.welcome'),
        user: {
          name: 'Info',
          color: '#ffffff'
        }
      })
      this.chatMessages.unshift(formattedMessage)

      this.socket.emit('join', JSON.stringify({
        message: `${this.$store.state.auth.username} ${this.$t('session.newParticipant')}`,
        user: {
          name: 'Info',
          color: this.$store.state.auth.color
        }
      }))

      this.setupListeners()
    },
    setupListeners () {
      this.socket.on('join', (data) => {
        this.chatMessages.unshift(JSON.parse(data))
      })
      this.socket.on('newMember', (data) => {
        this.onlineUsers = data
      })
      this.socket.on('disc', (data) => {
        this.chatMessages.unshift({ payload: data + this.$t('session.participantLeft'), type: 'chat', user: 'Info' })
      })
      this.socket.on('play', () => {
        if (this.$store.state.sessionHandler.role === 'participant') {
          this.$refs.video.play()
        }
      })
      this.socket.on('pause', () => {
        if (this.$store.state.sessionHandler.role === 'participant') {
          this.$refs.video.pause()
        }
      })
      this.socket.on('seekTo', (timeData) => {
        if (this.$store.state.sessionHandler.role === 'participant') {
          this.time = JSON.parse(timeData)
        }
      })
      this.socket.on('chat', (data) => {
        this.chatMessages.unshift(data)
      })
    },
    closeSession () {
      const formattedMessage = this.$sendWS({
        message: this.$store.state.auth.username + ' ' + this.$t('session.participantLeft'),
        user: {
          name: '',
          color: '#ffffff'
        }
      })
      this.socket.emit('bye', JSON.stringify(formattedMessage))
      this.socket.disconnect()
      this.started = false
      this.initialized = false
      this.uniqueid = ''
      this.time = 0
    },
    generateUniqueId () {
      this.uniqueid = nanoid(6)
    },
    chat (data) {
      const formattedMessage = this.$sendWS({
        message: data.message,
        user: {
          name: this.$store.state.auth.username,
          color: this.$store.state.auth.color
        }
      })
      this.chatMessages.unshift(formattedMessage)
      this.socket.emit('chat', formattedMessage)
    }
  }
}
</script>
<style>

</style>
