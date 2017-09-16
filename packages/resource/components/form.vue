<template lang="html">
  <div :class="{
    'sect': true,
    'hidden': !show,
    'not-saved': !isSaved,
    'saved': isSaved
  }" @keyup="update">
    <div :class="{
      'hide': true,
      'expand': !show
    }" >
      <span v-if="!show">{{raw.title}}</span>
      <span>
        <span @click="save" class="saveForm">Save</span>
        <span style="margin:0.5rem">|</span>
        <span @click="show = !show">Hide</span>
      </span>


    </div>
    <div v-if="show">
      <search v-model="raw.title" files="apps" attr="title" temp="App Title" v-on:chosen="chosen"></search>
      <search v-model="raw.image" files="images" attr="" temp="Image"></search>
      <input v-model="raw.version" type="text" placeholder="Version" >
      <search v-model="raw.dl" files="ipas" attr="" temp="Unsigned IPA"></search>
      <input v-model="raw.signed" type="text" placeholder="Signed Download Link" >
      <div style="position:relative">
        <div class="" @click="preview = !preview">
          <i class="fa fa-eye togglePreview"></i>
        </div>

        <textarea v-model="raw.desc" rows="8" cols="80"  placeholder="App Description">
        </textarea>
      </div>

    </div>

    <div class="preview" v-if="preview">
      <div class="hide" @click="preview = !preview">
        Close
      </div>
      <span v-html="mark(raw.desc)"></span>
      <div class="nothing" v-if="raw.desc.length <= 0">
        <div class="">
          nothing to see here :(
        </div>
        <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">Learn to use markdown</a>
      </div>
    </div>
  </div>
</template>

<script>
let $mark = require('marked')
export default {
  props: ['watchsave'],
  data() {
    return {
      raw: {
        image: '',
        dl: '',
        title: '',
        version: '',
        signed: '',
        desc: '',
      },
      saved: {},
      isSaved: true,
      show: true,
      mark: $mark,
      preview: false
    }
  },
  methods: {
    update() {
      this.isSaved = JSON.stringify(this.raw) == JSON.stringify(this.saved)
      this.$emit('update', this)
    },

    save(){
      return new Promise((resolve, reject) => {
        if (
          this.raw.image.length > 0 &&
          this.raw.title.length > 0 &&
          this.raw.version.length > 0 &&
          this.raw.desc.length > 0
        ) {
          this.saved = JSON.parse(JSON.stringify(this.raw))
          axios.post('/app/save', this.saved)
            .then((res)=>{
              this.update()
              return resolve(res)
            })
            .catch((err)=>reject(err))

          }
      });


    },
    chosen(e){
      let val = e.target.innerHTML
      axios.post('/json', {
        what: val
      })
      .then( r => {
        this.raw = r.data
      })
    }
  },
  watch: {
    watchsave(val){
      if (val > 0){
        this.save()
      }
    }
  }
}
</script>

<style lang="css">

.sect {
    width: calc(33.3333333333% + -6px);
    padding: 2.2rem 2rem;
    border: 1px solid black;
    box-sizing: border-box;
    background: #f2f2f2;
    position: relative;
    border-width: 3px;
    display: inline-block;
    margin: 3px;
}.sect.hidden{padding: 1.6rem}
.sect.not-saved {
    border-color: #b34b4b;
    background: #f3e3e3;
}
input, textarea {
    display: block;
    border: 1px solid;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    margin: 1rem 0;
    width: 100%;
    border-radius: 1rem;
    outline: none;
    box-sizing: border-box;
    resize: vertical;
}

.hide {
    font-size: 1rem;
    font-family: sans-serif;
    letter-spacing: 0.2rem;
    position: absolute;
    top: 1px;
    right: 3px;
    cursor: pointer;
    z-index: 2;
    background: inherit;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    width: auto;
    box-sizing: border-box;
}
.hide.expand{
  width: calc(100% - 4px);
}
.search-results {
    background: white;
    position: absolute;
    bottom: 1px;
    transform: translateY(100%);
    z-index: 3;
    box-sizing: border-box;
    border: 1px solid;
    width: 100%;
    max-height: 15rem;
    overflow-y: auto;
}
.search{
  position: relative;
}
input.found{
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.preview {
    display: flex;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    width: 90vw;
    height: 90vh;
    border: 2px solid black;
    box-shadow: 0 100vw 0 200vw rgba(0, 0, 0, 0.79);
    box-sizing: border-box;
    font-family: sans-serif;
    letter-spacing: 0.1rem;
    z-index: 10;
}
.preview span {
  overflow: auto;
  width: calc( 100% + 1rem);
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 2rem;
  box-sizing: border-box;
}
.togglePreview{
  position: absolute;
  top: 1rem;
  right: 1rem;
  opacity: 0.5;
}.togglePreview:hover{
  cursor: pointer;
  opacity: 1;
}
.nothing {
    font-size: 1.2rem;
    font-family: sans-serif;
    align-self: center;
    margin: auto;
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    text-align: center;
    line-height: 3rem;
    z-index: 20;
}
</style>
