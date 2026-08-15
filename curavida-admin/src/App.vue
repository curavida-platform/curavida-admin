<template>
  <RouterView />
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

img {
  max-width: 100%;
  display: block;
}

#app {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style>