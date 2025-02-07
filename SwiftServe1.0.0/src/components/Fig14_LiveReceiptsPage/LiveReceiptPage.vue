<template>
  <div class="profile-container">
    <div class="profile-info">
      <div class="avatar">
        <img src="/ProfilePicture.png" alt="User Avatar" />
      </div>
      <div class="info-text">
        <h2 class="info-details">{{ name }}</h2>
        <p class="info-details">{{ email }}</p>
      </div>
    </div>
    <div class="actions">
      <router-link to="/profile" class="action-link" id="profileLink">
        <button @click="updateSettings">
          <img src="/cog.svg" alt="Update Settings" class="icon" />
          <span>Update Settings</span>
        </button>
      </router-link>
      <router-link to="/livereceipt" class="action-link" id="liveReceiptLink">
        <button @click="showRecentOrder">
          <img src="/RecentOrder.png" alt="Recent Order" class="icon" />
          <span>Most Recent Order Receipt</span>
        </button>
      </router-link>
      <button @click="openDeleteModal" id="deleteButton">
        <img src="/DeleteAccount.png" alt="Delete Account" class="icon" />
        <span>Delete Account</span>
      </button>
    </div>

    <!-- Custom Modal for Confirming Account Deletion -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="closeDeleteModal">&times;</button>
        <div class="modal-text">
          <h2>Confirm Account Deletion</h2>
          <p>
            We'll miss having you with us! For your security, kindly enter your current password
            below.
          </p>
          <input
            type="'text'"
            v-model="currentPassword"
            placeholder="Enter current password"
            class="centered-input"
            :style="{ '-webkit-text-security': showPassword ? 'none' : 'disc' }"
          />
          <div class="modal-actions">
            <button @click="confirmDeleteAccount" class="modal-button">Confirm Delete</button>
            <button @click="closeDeleteModal" class="modal-button">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCustomModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">&times;</button>
        <div class="modal-text">
          <h2>Notification</h2>
          <p>{{ modalMessage }}</p>
          <div class="modal-actions">
            <button @click="closeModal" class="modal-button">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from '@/firebase.js'
import { getFirestore, doc, deleteDoc } from 'firebase/firestore'
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth'

if (import.meta.env.MODE !== 'test') {
  var db = getFirestore(firebaseApp)
}

export default {
  name: 'ProfileComponent',

  data() {
    return {
      name: '',
      email: '',
      user: false,
      showDeleteModal: false,
      currentPassword: '',
      showCustomModal: false,
      modalMessage: ''
    }
  },

  mounted() {
    if (import.meta.env.MODE !== 'test') {
      const auth = getAuth()
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.user = user
          this.setProfile()
        }
      })
    }
  },

  methods: {
    setProfile() {
      this.name = this.user.displayName
      this.email = this.user.email
    },
    updateSettings() {},
    showRecentOrder() {},
    openDeleteModal() {
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.currentPassword = ''
    },
    openModal(message) {
      this.modalMessage = message
      this.showCustomModal = true
    },
    closeModal() {
      this.showCustomModal = false
    },
    async confirmDeleteAccount() {
      if (!this.currentPassword) {
        this.openModal('Please enter your current password.')
        return
      }

      try {
        // Reauthenticate the user with their email and current password
        const credential = EmailAuthProvider.credential(this.email, this.currentPassword)
        await reauthenticateWithCredential(this.user, credential)
        const userDocRef = doc(db, 'UserProfile', this.user.uid)
        await deleteDoc(userDocRef)
        await deleteUser(this.user)
        this.openModal('Account deleted successfully. Proceeding to home page.')
        this.$router.push('/').then(() => {
          location.reload()
        })
      } catch (error) {
        this.openModal('Error deleting account: ' + error.message)
      } finally {
        this.closeDeleteModal()
      }
    }
  }
}
</script>

<style scoped>
/* Profile container and actions styles remain the same */
/* .profile-container {
  background-color: #00adb5;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  font-family: 'Inria Sans', sans-serif;
  align-items: flex-start;
  width: 15vw;
  height: 100vh;
} */

.profile-container {
  position: absolute;
  top: 15vh;
  left: 0;
  width: 20vw;
  height: 100vh;
  background-color: #00adb5;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: 'Inria Sans', sans-serif;
  box-sizing: border-box;
}

.profile-info {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 10vh;
}

.avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #ffffff;
  margin-bottom: 1vh;
}

.info-text {
  text-align: center;
}

.centered-input {
  width: 70%;
  padding: 1vw;
  margin: 1vw auto;
  display: block;
  border: 2px solid #00adb5;
  border-radius: 4px;
  font-size: 1.3vw;
  font-family: 'Inria Sans', sans-serif;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 2vw;
  margin-left: 2vw;
}

button {
  font-family: 'Inria Sans', sans-serif;
  font-size: 1.3vw;
  background: none;
  border: none;
  color: #000000;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 2px;
}

button .icon {
  margin-right: 10px;
  width: 20px;
  height: 20px;
  text-align: center;
}

button:hover {
  color: #ffffff;
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
  text-align: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  border: 2px solid #00adb5;
  width: 400px;
  padding: 30px;
  position: relative;
  z-index: 1010;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #00adb5;
  color: white;
  border: none;
  border-radius: 3px;
  width: 30px;
  height: 30px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-text {
  font-family: 'Inria Sans', sans-serif;
  color: #00adb5;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-direction: column;
  align-items: center;
}

.modal-actions button {
  background-color: #00adb5;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  width: 50%;
  margin-bottom: 10px;
  text-align: center;
  font-size: 15px;
}

.modal-actions button:last-child {
  margin-bottom: 0;
}

.modal-actions button:hover {
  background-color: #007a80;
}

.modal-button {
  font-weight: bold;
}

.info-details {
  font-size: 1.5vw;
  font-family: 'Inria Sans', sans-serif;
}

.action-link {
  text-decoration: none; /* This removes the underline from router-links */
  color: inherit; /* Ensures it takes the color of the button */
}

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
  text-align: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  border: 2px solid #00adb5;
  width: 400px;
  padding: 30px;
  position: relative;
  z-index: 1010;
  text-align: center;
  font-family: 'Inria Sans', sans-serif;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #00adb5;
  color: white;
  border: none;
  border-radius: 3px;
  width: 30px;
  height: 30px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1020;
}

.modal-text {
  font-family: 'Inria Sans', sans-serif;
  color: #00adb5;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  font-family: 'Inria Sans', sans-serif;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-direction: column;
  align-items: center;
}

.modal-actions button {
  background-color: #00adb5;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  width: 50%;
  margin-bottom: 10px;
  text-align: center;
  font-size: 15px;
}

.modal-actions button:last-child {
  margin-bottom: 0;
}

.modal-actions button:hover {
  background-color: #007a80;
}

.modal-button {
  font-weight: bold;
  font-family: 'Inria Sans', sans-serif;
}
</style>
