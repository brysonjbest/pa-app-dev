<template>
  <div id="app">
    <header>
      <NavBar />
      <Message />
    </header>
    <main>
      <div class="container mt-3">
        <router-view />
      </div>
    </main>
    <footer>
      <Footer />
    </footer>
  </div>
</template>

<script>

import NavBar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Message from '@/components/common/Message'

export default {
  name: 'app',
  components: {
    NavBar,
    Message,
    Footer
  }
}

</script>

<style>
main {
  margin-top: 80px;
  padding-bottom: 200px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
