<template lang="html">
  <div :class="{
          'sect': true,
          'hidden': !show,
          'not-saved': !isSaved,
          'saved': isSaved
        }" @keyup="update" v-if="open">

    <div :class="{
      'hide': true,
      'expand': !show
    }">
      <span v-if="!show" class="title">{{raw.title}}</span>
      <span @mouseout="tooltip($event, '', false)">
        <span @click="save" class="saveForm" @mouseover="tooltip($event, 'Save', true)" >
          <i class="fa fa-save"></i>
        </span>
        <span style="margin:0.5rem">|</span>
        <span @click="show = !show" @mouseover="tooltip($event, 'Hide', true)">
          <i class="fa fa-eye"></i>
        </span>
        <span style="margin:0.5rem">|</span>
        <span @mouseover="tooltip($event, 'Close', true)" @click="open = false">
          <i class="fa fa-times"></i>
        </span>
      </span>

      <span id="tooltip" v-show="showToolip"></span>


    </div>
    <div v-if="show">
      <search v-model="raw.title" files="apps" attr="title" temp="App Title" v-on:chosen="chosen"></search>
      <search v-model="raw.image" files="images" attr="" temp="Image"></search>
      <input v-model="raw.version" type="text" placeholder="Version" >
      <search v-model="raw.dl" files="ipas" attr="" temp="Unsigned IPA"></search>
      <input v-model="raw.signed" type="text" placeholder="Signed Download Link" >
      <input v-model="raw.tags" type="text" placeholder="ex. game, tweak, cheat, premium" />
      <div style="position:relative">
        <div class="" @click="preview = !preview">
          <i class="fa fa-eye togglePreview"></i>
        </div>

        <textarea v-model="raw.desc" rows="8" cols="80"  placeholder="App Description"></textarea>
      </div>
      <button type="button" class="btn btn-danger" @click="del">
        <i class="fa fa-trash"></i> Delete <span class="title">{{raw.title}}</span>
      </button>

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
//
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
        tags: '',
        desc: '',
      },
      saved: {},
      isSaved: true,
      show: true,
      mark: $mark,
      preview: false,
      showToolip: false,
      open: true,
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
            .catch((err)=>{reject(err)})

          }
          else reject()
      });
    },

    del() {
      return new Promise((resolve, reject) => {
        this.save()
        .then(res => {
          return axios.post('/app/delete', this.saved)
        })
        .catch(err => {
          this.open = false
        })
        .then(res => {
          this.update()
          this.open = false
          return resolve(res)
        })
        .catch((err)=>reject(err))
      });
    },

    tooltip(e, msg, show){
      if (show) this.showToolip = true
      else this.showToolip = false
      $('#tooltip').html(msg)
      $('#tooltip').css({
        top: `${e.clientY}px`,
        left: `${e.clientX}px`
      })

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
      width: 400px;
      padding: 2.8rem 2rem 1rem;
      border: 1px solid black;
      box-sizing: border-box;
      background: #f2f2f2;
      position: relative;
      border-width: 3px;
      display: inline-block;
      margin: 5px auto;
  }.sect.hidden{padding: 1.9rem}
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
      font-size: 1.5rem;
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
      opacity: 1;
  }
  .hide span span {
    opacity: 0.5;
    position: relative;
  }
  .hide span span:hover {
    opacity: 1;
    cursor: pointer;
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
  #tooltip {
    position: fixed;
    z-index: 30;
    background: black;
    color: white;
    font-size: 0.7rem;
    padding: 0.5rem;
    border-radius: 1rem;
    letter-spacing: initial;
}
.hide .title {
    white-space: pre;
    max-width: 50%;
    text-overflow: ellipsis;
    overflow: hidden;
}
.btn .title{
  margin-left: 1rem;
  font-weight: bold;
}
</style>
