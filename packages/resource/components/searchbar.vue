<template>
  <div class="search-bar">
    <input type="text" class="search-field" placeholder="Search..." v-model="$parent.store" @keyup="search">

    <div class="filters">
      <div class="checkbox" @click="toggle('signed')">
        <div :class="{'selected': filters.signed}" ></div>
        <span>Signed</span>
      </div>

      <div class="checkbox" @click="toggle('unsigned')">
        <div :class="{'selected': filters.unsigned}"></div>
        <span>Unsigned</span>
      </div>

      <div class="checkbox" @click="toggle('tags')">
        <div :class="{'selected': filters.tags}" ></div>
        <span>Games</span>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  data () {
    return {
      filters:{
        signed: false,
        unsigned: false,
        tags: false
      }
    }
  },
  methods: {
    search: function(e){
      this.$emit("result", this.filters)
    },
    toggle: function (item) {
      this.filters[item] = !this.filters[item]
      this.$emit("result", this.filters)
    }
  },
  mounted () {
    this.$emit("result", this.filters)
  }
}
</script>

<style lang="scss" scoped>

$search-color: #000;
$placeholder-color: lighten($search-color, 30%);

.filters{
  display: flex;
}
.checkbox {
    display: flex;
    padding: 10px;
    align-items: center;
    justify-content: center;
    color: black;
    cursor: pointer;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    div{
      border: 1px solid black;
      padding: 12px;
      display: inline-block;
      border-radius: 50%;
      background: white;
      margin-right: 10px;
    }

    .selected {
      background: black;
    }
}

.search-bar {
  margin: 5px;
}

::-webkit-input-placeholder {
  color: $placeholder-color !important;
  opacity: 1.0;
}

:-moz-placeholder {
  color: $placeholder-color !important;
  opacity: 1.0;
}

:-ms-input-placeholder {
  color: $placeholder-color !important;
  opacity: 1.0;
}

.search-field {
  color: $search-color;
  font-size: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: white;
  border: 1px black solid;
}
.search-field:focus {
  box-shadow: 0 0 0 2px #121212;
}
.search-bar {
  width: 100%;
  padding: 0px;
}
</style>
