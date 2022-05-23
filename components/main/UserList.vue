<template>
  <div style="position:absolute;top:30px;left:30px;float:left;z-index:100;width:200px;">
    <div
      v-for="user in onlineusers"
      :key="user.id"
    >
      <strong :style="`color:${user.color}`">{{ user.username }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onlineusers: {
      type: Array,
      required: true
    }
  }
}
</script>
