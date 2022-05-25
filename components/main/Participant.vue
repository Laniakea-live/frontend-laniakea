<template>
  <div>
    <v-alert
      text
      dense
      icon="mdi-check"
      border="left"
    >
      <h3>
        {{ $t('participant.title') }} <strong>{{ $store.state.auth.username }}</strong>
      </h3>
    </v-alert>
    <v-card v-if="!$store.state.sessionHandler.started" class="mt-5 mx-auto pa-3 rounded-xl" max-width="774" color="rgba(10,30,120,.3)" elevation="0">
      <v-row class="justify-center">
        <v-btn
          color="red darken-1"
          class="mt-3 mb-3 white--text"
          rounded
          elevation="0"
          @click="$store.commit('sessionHandler/unstage'), $router.push('/')"
        >
          {{ $t('session.switchRoleBtn') }}
          <v-icon
            right
          >
            mdi-account-arrow-left-outline
          </v-icon>
        </v-btn>
      </v-row>
      <v-card-text>
        <v-text-field
          v-model="uniqueid"
          class="justify-self-center"
          :label="$t('participant.uniqueIdSelectorLabel')"
          hide-details
          outlined
          prepend-icon="mdi-fingerprint"
          @keyup="updateUniqueIdOnStore"
        />
      </v-card-text>
      <v-card-text>
        <client-only>
          <v-file-input
            v-model="video"
            color="deep-purple accent-4"
            counter
            :label="$t('participant.fileInputTitle')"
            :placeholder="$t('participant.fileInputPlaceholder')"
            prepend-icon="mdi-paperclip"
            outlined
            :show-size="1000"
          >
            <template #selection="{ text }">
              <v-chip
                color="deep-purple accent-4"
                dark
                label
                small
              >
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
        </client-only>
      </v-card-text>
      <v-card-text>
        <v-btn
          elevation="0"
          :color="$store.state.sessionHandler.started ? 'green darken-4' : 'deep-purple accent-4'"
          large
          rounded
          x-large
          block
          @click="beginSession()"
        >
          <v-icon>mdi-broadcast</v-icon> {{ $store.state.sessionHandler.started ? $t('participant.btnBeginStarted') : $t('participant.btnBegin') }}
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-text v-if="$store.state.sessionHandler.started" class="text-left px-0 pb-0 d-flex" style="height:100vh">
        <MainPlayer />
      </v-card-text>
    </v-card>
    <v-card v-if="!$store.state.sessionHandler.started" class="mt-5 mx-auto pa-3 rounded-xl" max-width="774" color="rgba(10,30,120,.3)" elevation="0">
      <p class="mx-auto text-center">
        {{ $t('tutorial2.first') }}
      </p>
      <ul>
        <li>{{ $t('tutorial2.second') }}</li>
        <li>{{ $t('tutorial2.third') }}</li>
        <li>{{ $t('tutorial2.fourth') }}</li>
        <li>{{ $t('tutorial2.fifth') }}</li>
      </ul>
    </v-card>
    <MainAd />
  </div>
</template>

<script>
export default {
  name: 'ParticipantView',
  data () {
    return {
      video: [],
      uniqueid: ''
    }
  },
  head () {
    return {
      title: 'Join session now - ' + this.$t('index.tabInfo'),
      meta: [
        { hid: 'language', name: 'language', content: 'es' },
        { hid: 'language', name: 'language', content: 'en' },
        { hid: 'audience', name: 'audience', content: 'all' },
        { hid: 'rating', name: 'rating', content: 'general' },
        { hid: 'distribution', name: 'distribution', content: 'global' },
        { hid: 'document-type', name: 'document-type', content: 'Public' },
        { hid: 'MSSmartTagsPreventParsing', name: 'MSSmartTagsPreventParsing', content: 'true' },
        { hid: 'robots', name: 'robots', content: 'all' },
        { hid: 'robots', name: 'robots', content: 'all, index, follow' },
        { hid: 'googlebot', name: 'googlebot', content: 'all, index, follow' },
        { hid: 'yahoo-slurp', name: 'yahoo-slurp', content: 'all, index, follow' },
        { hid: 'msnbot', name: 'msnbot', content: 'index, follow' },
        { hid: 'googlebot-image', name: 'googlebot-image', content: 'all' },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: 'Watch movies, videos, and more in sync with your friends' },
        { hid: 'og:url', property: 'og:url', content: 'https://laniakea.live' },
        { hid: 'og:image', property: 'og:image', content: 'https://laniakea.live/favicon.jpg' },
        { hid: 'author', name: 'author', content: 'laniakea' }
      ]
    }
  },
  computed: {
    hasFocus () {
      return document.hasFocus()
    }
  },
  methods: {
    beginSession () {
      this.$store.dispatch('sessionHandler/blobURL', window.URL.createObjectURL(this.video))
    },
    updateUniqueIdOnStore () {
      this.$store.commit('sessionHandler/updateUniqueId', this.uniqueid)
    }
  }
}
</script>
<style>

</style>
