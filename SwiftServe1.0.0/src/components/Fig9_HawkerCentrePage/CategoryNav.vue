<template>
  <nav>
    <ul>
      <li
        v-for="category in categories"
        :key="category"
        @click="$emit('category-selected', category)"
        :class="{ active: activeCategory === category }"
      >
        {{ category }}
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    activeCategory: {
      type: String,
      required: true // Passed from the parent to track the active category
    }
  },
  data() {
    return {
      categories: ['All', 'Chinese', 'Western', 'Malay', 'Indian', 'Others', 'Beverages'] // Category list
    }
  }
}
</script>

<style scoped>
nav {
  position: absolute;
  top: 18vh;
  left: 10vw;
  width: 100vw;
  height: 5vh;
  border-bottom: 0.3vh solid black;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 0vw;
  display: flex;
  gap: 0.5vw;
  flex-wrap: wrap;
  width: 100%;
}

nav li {
  padding: 0.75vh 0.75vw;
  cursor: pointer;
  font-weight: bold;
  border-bottom: 0.2vh solid transparent;
  font-size: 1.75vw;
  transition:
    color 0.3s ease,
    border-bottom 0.3s ease;
}

nav li:hover {
  color: #00adb5;
}

nav li.active {
  font-weight: bold;
  color: #00adb5;
}
</style>
