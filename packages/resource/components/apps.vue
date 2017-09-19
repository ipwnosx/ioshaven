<template lang="html">
  <div class="apps">

    <myform v-for="n in count" :key="count.id" v-on:update="update($event, n)"></myform>

    <div class="menu">
      <div class="opt" @click="count++">
        <i class="fa fa-plus"></i>
      </div>

      <div class="opt"  @click="saveAll">
        <i class="fa fa-spinner fa-spin fa-fw" v-if="savingAll"></i>
        <i class="fa fa-save" v-else=""></i>
        <span>Save All</span>
      </div>

      <div class="opt danger" @click="goLive">
        <i class="fa fa-spinner fa-spin fa-fw" v-if="goingLive"></i>
        <i class="fa fa-cloud-upload" v-if="!goingLive"></i>
        <span>{{goingLive}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      forms: [],
      goingLive: false,
      savingAll: false
    }
  },
  methods: {
    update(e, id) {
      this.forms[id-1] = e
    },
    saveAll() {
      this.savingAll = true
      let p = []
      _.forEach(this.forms, f => {
        p.push(f.save())
      })
      return Promise.all(p).then(()=>{
        console.log('all done!!');
        this.savingAll = false
      })
    },
    goLive() {
      this.goingLive = true
      setTimeout(()=>{
        axios.post("/golive")
        .then(result=>{
          console.log(result.data);
          this.goingLive = false
        })
      },1000)



    }
  }
}
</script>

<style lang="scss">
.apps {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
}
.menu {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: sans-serif;
    text-transform: capitalize;
}
.opt {
    background: #2196F3;
    padding: 1rem 1.1rem;
    border-radius: 3rem;
    font-size: 1rem;
    color: white;
    margin: 1rem 0.5rem;
    margin-top: 0;
}
.opt span {
  margin-left: 0.5rem;
}
.opt:hover {
  cursor: pointer;
  background: lighten(#2196F3, 7%);
}
.danger {
  background: #e02727;
}
.danger:hover {
  background: lighten(#e02727, 7%);
}
</style>
