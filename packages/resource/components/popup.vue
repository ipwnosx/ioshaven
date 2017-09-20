<template lang="html">
  <div class="popup">

    <a href="" class="btn btn-primary desc" @click="toggle">More Info</a>


    <div class="win" v-if="show">
      <div class="win-content win-header">
        <span class="title">
          <span>{{title}}</span>
          <span class="ad" v-if="advert">Promoted</span>
        </span>

        <span @click="show = false" class="close">close <i class="fas fa-times"></i></span>
      </div>
      <div class="win-content win-body">
        <span v-html="description" class="markdown-body">
          <!-- <div class="appIMG" :style="{'background-image': 'url('+ image +')'}"></div> -->
          <!-- <span  ></span> -->
        </span>
      </div>
      <div class="win-content win-footer">
        <span v-if="!advert">Version: {{version}}</span>
        <span v-if="advert"></span>
        <div class="">
          <a :href="signed" class="btn btn-primary" v-if="advert">View Promotion</a>
          <a :href="dl" class="btn btn-primary" v-if="dl && !advert">Download.ipa</a>
          <a :href="signed" class="btn btn-success" v-if="signed && !advert">Install Signed</a>
        </div>

      </div>

    </div>


  </div>
</template>

<script>
export default {
  props: ['title', 'description', 'image', 'dl', 'signed', 'version', 'advert'],
  data() {
    return {
      show: false,
    }
  },
  methods: {
    toggle(e) {
      e.preventDefault()
      this.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
$text: #333;
$border: #000;


$small: 10px;
$medium: 20px;
$large: 50px;

.desc {
  padding: 30px;
  width: 100%;
  color: #444 !important;
  margin: 4px 0px;
  background: transparent;
  border: 1px solid #444;
}
.win {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid $border;
    box-shadow: 0px 2px 29px 10000px rgba(0, 0, 0, 0.75);
    border-radius: 5px;
    z-index: 999999;
    max-width: 960px;
    margin: 30px auto;
    @media screen and (max-width: 576px) {
        margin: 10px auto !important;
    }
    @media screen and (max-width: 768px) {
        margin: $medium auto !important;
    }
    @media screen and (max-width: 992px) {
        margin: $large auto !important;
    }
}

.win-content {
    padding: 2em;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    color: $text;
}
.win-content.win-header {
    height: 5em;
}
.win-content.win-body {
    align-items: start;
    border-bottom: none;
    padding: 1em 1.5em 2em;
    font-size: 1.3em;
    letter-spacing: 0.7px;
    line-height: 1.4em;
    max-height: 50vh;
    overflow-y: auto;
}
.win-header span {
    font-size: 1.2em;
    font-weight: 600;
}

.appIMG {
    display: inline-block;
    padding: 50px;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: contain;
    margin-right: 20px;
    float: left;
}
.title {
  font-size: 1.4em !important;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

.win-footer{
  border-top: 1px solid #ccc;
  padding: 1em 2em;
  font-size: 1em;
  @media screen and (max-width: 576px) {
      font-size: 0.7em;
  }
  @media screen and (max-width: 400px) {
      font-size: 0.6em;
  }
  .span {
    color: #aaa !important;
    font-size: inherit !important
  }
  div{
    text-align: right;
  }
  a{
    padding: 1.5em;
    font-size: inherit !important
  }
}

span.ad {
    font-size: 0.8rem !important;
    font-weight: 100 !important;
    background: #61c361;
    color: white;
    padding: 0rem 1rem;
    border-radius: 10rem;
    margin-left: 1rem;
}
</style>
