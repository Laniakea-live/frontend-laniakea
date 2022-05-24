<template>
  <div style="position:absolute;top:30px;left:30px;float:left;z-index:100;width:200px;opacity:0.8">
    <div
      v-for="user in onlineusers"
      :key="user.id"
    >
      <span class="d-flex" style="cursor:pointer;">
        <strong :style="`color:${user.color}`">{{ user.username }}</strong>
        <div class="circle" />
      </span>
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

<style>
.circle {
    width: 9px;
    height: 9px;
    background-color: #62bd19;
    border-radius: 50%;
    top: 23px;
    left: 23px;
    margin-left: 7px;
    margin-top: 8px;
}
</style>
