<template>
<div class="box2 col-md-6 col-lg-4 col-xl-3">
  <div class="inside" v-if="advert">
    <h4 class="center color-black"></h4>
    <img :src="$advert().image" class="center-block" />
    <popup
      :advert="true"
      :image="$advert().image"
      :title="$advert().title"
      :description="$advert().desc"
      dl=""
      :signed="$advert().link"
      version=""
    ></popup>
    <a :href="$advert().link" class="btn btn-success center-dl center-s-dl">Promotion</a>
  </div>

  <div class="inside" v-else="">
    <h4 class="center color-black">{{title}}</h4>
    <img :src='image' class="center-block" />
    <br>
    <p class="center color-black">{{version}}</p>
    <popup
      :advert="false"
      :image="image"
      :title="title"
      :description="desc"
      :dl="dl"
      :signed="signed"
      :version="version"
    ></popup>
    <a v-if="signed" :href="signed" class="btn btn-success center-dl center-s-dl">Install Signed</a>
    <a v-if="dl" :href="dl" class="btn btn-primary center-dl">Download .ipa</a>
  </div>
</div>
</template>

<script>
export default {
  props: {
    "image": {
      required: false
    },
    "title": {
      required: false
    },
    "desc": {
      required: false
    },
    "dl": {
      required: false
    },
    "signed": {
      required: false
    },
    "version": {
      required: false
    },
    "advert": {
      required: false
    },
  },
  data() {
    return {

    }
  },
  methods: {
    $advert(){
      return this.$parent.adverts[this.advert]
    }
  },
  mounted() {
    console.log('this advert is: '+this.advert);
  }
}
</script>

<style lang="css" scoped>
img {
  cursor: default;
  pointer-events: none;
  width: 150px;
  height: 150px;
}

.desc {
  height: 200px;
  overflow-y: auto;
}

h4 {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
    text-transform: none;
}
.center-dl {
    padding: 30px;
    width: 100%;
    color: white !important;
    margin: 4px 0px;
}

.box2 {
  padding: 5px;

}
.inside {
    border: 1px black solid;
    padding: 30px;
    position: relative;
    background-color: white;
    text-align: center;
    overflow-y: hidden;
}
.inside * {
  color: black;
}
</style>
