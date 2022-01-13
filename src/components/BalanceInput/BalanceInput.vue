<template>
<div class="input-container">
  <a-input v-model="value" :placeholder="placeholder" @change="changeClick">
    <a-select slot="addonAfter" style="width: 90px" v-model="uintPower">
      <a-select-option :value="item.power" v-for="(item,index) in uintOptions" :key="index">
        {{ item.text }}
      </a-select-option>
    </a-select>
  </a-input>
</div>
</template>

<script>
import {formatBalance} from "@polkadot/util";
import BigNumber from "bignumber.js";
export default {
  name: "Input",
  props: {
    changeClick: {
      type: Function,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      value: "",
      uintPower: 0,
      uintOptions: [],
    }
  },
  mounted() {
    this.getUintOptions();
  },
  methods: {
    //Get company information
    getUintOptions() {
      this.uintOptions = formatBalance.getOptions();
      this.uintOptions.unshift({power:-3,text:"milli",value: '-'});
      this.uintOptions.unshift({power:-6,text:"micro",value: '-'});
      this.uintOptions.unshift({power:-9,text:"nano",value: '-'});
      this.uintOptions.unshift({power:-12,text:"pico",value: '-'});
    },
    getPrice() {
      return new BigNumber(this.value).times(new BigNumber(Math.pow(10,this.uintPower))).times(new BigNumber(Math.pow(10,12))).toNumber();
    }
  }
}
</script>

<style lang="scss" scoped>
.input-container {
  width: 100%;
}
</style>
