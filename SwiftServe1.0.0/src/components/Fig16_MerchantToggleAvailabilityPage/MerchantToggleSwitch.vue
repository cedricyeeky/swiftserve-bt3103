<template>
  <div class="stall-toggle">
    <h3 class="closeStallText">Click to open / close stall</h3>
    <label class="switch">
      <!-- <input type="checkbox" :checked="value" @change="$emit('update:value', $event.target.checked)"> -->
      <input type="checkbox" :checked="modelValue" @change="toggle" />
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggle(event) {
      this.$emit('update:modelValue', event.target.checked)
    }
  }
}
</script>

<style scoped>
.stall-toggle {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #00adb5;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.closeStallText {
  color: #000000;
}
</style>
