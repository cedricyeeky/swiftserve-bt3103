<template>
  <div class="headerContainer">
    <div id="logo">
      <img src="/SwiftServeLogoHoriz.png" alt="SwiftServeLogoHoriz" class="SSLogo" />
    </div>

    <div class="welcomeCust">
      <h2>Welcome {{ this.user.displayName }}!</h2>
    </div>
    <img
      src="/dashboardButton.png"
      alt="DashboardButton"
      class="headerButtons"
      id="dButton"
      @click="CDashClick"
    />
    <img
      src="/settingsButton.png"
      alt="SettingsButton"
      class="headerButtons"
      id="sButton"
      @click="SettingsClick"
    />
    <img
      src="/logoutButton.png"
      alt="LogoutButton"
      class="headerButtons"
      id="lButton"
      @click="openLogoutModal"
    />

    <!-- Modal for logout confirmation -->
    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="closeLogoutModal">&times;</button>
        <div class="modal-text">
          <h2>
            <!-- Are you sure you want to log out? -->
            Sign out and return later?
          </h2>
          <div class="modal-actions">
            <button @click="confirmLogout">Yes, sign me out</button>
            <button @click="closeLogoutModal">No, stay signed in</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
export default {
  name: 'UniversalHeader',

  data() {
    return {
      user: false,
      showLogoutModal: false // Control the modal visibility
    }
  },

  mounted() {
    if (import.meta.env.MODE !== 'test') {
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user
        }
      })
    }
  },

  methods: {
    CDashClick() {
      this.$router.push('/custD')
    },

    SettingsClick() {
      this.$router.push('/profile')
    },

    openLogoutModal() {
      this.showLogoutModal = true
    },

    closeLogoutModal() {
      this.showLogoutModal = false
    },

    confirmLogout() {
      const auth = getAuth()
      signOut(auth)
        .then(() => {
          this.$router.push('/').then(() => {
            location.reload()
          })
          this.showLogoutModal = false // Close the modal after logging out
        })
        .catch((error) => {
          console.error('Error signing out: ', error)
        })
    }
  }
}
</script>

<style scoped>
.headerContainer {
  display: flex;
  align-items: center;
}

#logo {
  display: flex;
  align-items: center;
  z-index: 1;
}

img {
  width: 20vw;
  margin-left: 1vw;
}

h1 {
  color: #00adb5;
  font-weight: bold;
  font-family: 'Mada';
  font-size: 5vh;
}

.welcomeCust {
  position: relative;
  left: 13vw;
  font-size: 1.5vw;
  font-family: 'Inria Sans', sans-serif;
}

.headerButtons {
  width: 4vw;
}

#dButton {
  position: absolute;
  left: 78vw;
}

#sButton {
  position: absolute;
  left: 84vw;
}

#lButton {
  position: absolute;
  left: 90vw;
}

/* Modal styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  border: 2px solid #00adb5;
  width: 25vw;
  min-height: 15vh;
  padding: 30px;
  border-radius: 6px;
  position: relative;
  z-index: 1010;
  font-family: 'Inria Sans', sans-serif;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #00adb5;
  color: white;
  border: none;
  border-radius: 6px;
  width: 30px;
  height: 30px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
}

.modal-text h2 {
  font-size: 1.5vw;
  margin-top: 1vw;
  margin-bottom: 1.5vw;
  color: #00adb5;
  text-align: center;
  font-family: 'Inria Sans', sans-serif;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modal-actions button {
  background-color: #00adb5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-size: 1.2vw;
  font-family: 'Inria Sans', sans-serif;
}

.modal-actions button:hover {
  background-color: #007a80;
}
</style>
