<!-- this is the main file for figure 7!-->
<!-- additional future features;
          greying out
          buttons 
          bring the order ready button, new order button, preparing order button and quick order button to javascript-->

<script>
import firebaseApp from '../../firebase.js'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth' // Import the Firebase Auth
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore'

if (import.meta.env.MODE !== 'test') {
  var db = getFirestore(firebaseApp)
}

export default {
  name: 'CustOrders',

  data() {
    return {
      user: false,
      currentOrders: [], // Reference to currentOrders data imported
      past5Orders: [], // Reference to past5Orders data imported
      showQuickOrderPopup: false,
      selectedOrder: null,
      showCustomModal: false
    }
  },

  mounted() {
    if (import.meta.env.MODE !== 'test') {
      const auth = getAuth()
      if (auth.currentUser) {
        this.user = auth.currentUser.uid
      }
      this.getCurrentOrders(this.user)
      this.getPastOrders(this.user)
    }
  },

  methods: {
    openModal(message) {
      this.modalMessage = message
      this.showCustomModal = true
    },
    closeModal() {
      this.showCustomModal = false
      this.modalMessage = ''
    },

    goToDiningOptions() {
      this.$router.push('/diningOptions')
    },

    async updateORC(order) {
      const orderRef = doc(db, 'PlacedCustOrders', order.id)
      await updateDoc(orderRef, {
        collected: true
      })
      this.currentOrders = []
      this.past5Orders = []
      this.getCurrentOrders(this.user)
      this.getPastOrders(this.user)
    },

    async updateVON(order) {
      const orderRef = doc(db, 'PlacedCustOrders', order.id)
      const orderInfo = await getDoc(orderRef)
      const orderData = orderInfo.data()
      this.openModal('This Order Number is: ' + String(orderData.orderNum))
    },

    async getCurrentOrders(userId) {
      console.log(userId)
      let allOrders = await getDocs(collection(db, 'PlacedCustOrders'))

      for (const docs of allOrders.docs) {
        let docsData = docs.data()
        let docUserID = docsData.userId

        if (docUserID === this.user && !docsData.collected) {
          let temp = {}
          temp['id'] = docs.id
          temp['image'] = docsData.foodItemImage
          temp['restaurant'] = docsData.hawkerCentre
          temp['dish'] = docsData.merchantName
          temp['quantity'] = String(docsData.quantity + 'x ' + docsData.foodItemName)
          temp['readyForCollection'] = docsData.orderStatus ? 1 : 0
          temp['preparingOrder'] = !docsData.orderStatus
          this.currentOrders.push(temp)
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
    async getPastOrders(userId) {
      let ordersQuery = query(
        collection(db, 'PlacedCustOrders'),
        where('userId', '==', userId),
        where('collected', '==', true),
        orderBy('dateCreated', 'desc'),
        limit(5)
      )

      let allOrders = await getDocs(ordersQuery)

      for (const docs of allOrders.docs) {
        let docsData = docs.data()
        let temp = {}
        //push what is needed to create new order in order cart!!!!!!!!!!!!!!
        //temp['quantityFoodItem'] = String(docsData.quantity + 'x ' + docsData.foodItemName);
        temp['id'] = docs.id
        temp['orderNum'] = docsData.orderNum //change to better OrderNum
        temp['addOns'] = docsData.addOns
        temp['foodItemId'] = docsData.foodItemId
        temp['image'] = docsData.foodItemImage
        temp['foodItemName'] = docsData.foodItemName
        temp['foodItemPrice'] = docsData.foodItemPrice //change to current food item price
        temp['hawkerCentre'] = docsData.hawkerCentre
        temp['merchantId'] = docsData.merchantId
        temp['merchantName'] = docsData.merchantName
        temp['quantity'] = docsData.quantity
        temp['specialInstructions'] = docsData.specialInstructions
        temp['userId'] = docsData.userId
        this.past5Orders.push(temp)
      }

      // //javier: for testing purposes and overriding blanks
      // for (let i = 0; i <10; i++) {
      //   this.past5Orders.push({'OrderNum': 0,
      //     'addOns': 0,
      //     'foodItemId': 0,
      //     'foodItemName': 0,
      //     'foodItemPrice': 1,
      //     'hawkerCentre': 2,
      //     'merchantId': 1,
      //     'merchantName': 1,
      //     'quantity': 1,
      //     'specialInstructions': 1,
      //     'userId': 1});
      //   }
    },

    quickOrder(order) {
      this.selectedOrder = order
      this.showQuickOrderPopup = true
    },

    closePopup() {
      this.showQuickOrderPopup = false
      this.selectedOrder = null
    },

    continueOrder() {
      if (this.selectedOrder) {
        const orderId = this.selectedOrder.id
        // const foodItemId = this.selectedOrder.foodItemId;
        // const userId = this.selectedOrder.userId;
        // this.$router.push({
        //   path: `/food-item/${foodItemId}?/${userId}`,
        //   query: {
        //     HCName: this.selectedOrder.hawkerCentre,
        //     quickOrder: true,
        //     quantity: this.selectedOrder.quantity,
        //     addOns: JSON.stringify(this.selectedOrder.addOns)
        //   }
        // });
        this.$router.push({
          name: 'foodItemPage',
          params: {
            orderId: orderId // Pass the cart item ID
          },
          query: {
            HCName: this.selectedOrder.hawkerCentre
          }
        })
        //   this.$router.push({
        //     path: `/food-item/${orderId}`,
        //     query: {
        //       HCName: this.selectedOrder.hawkerCentre
        //     }
        // });
      }
    },

    scrollLeft() {
      if (this.$refs.ordersScroll) {
        this.$refs.ordersScroll.scrollBy({
          left: -this.$refs.ordersScroll.querySelector('.order-box').offsetWidth * 1.5,
          behavior: 'smooth'
        })
      }
    },

    scrollRight() {
      if (this.$refs.ordersScroll) {
        this.$refs.ordersScroll.scrollBy({
          left: this.$refs.ordersScroll.querySelector('.order-box').offsetWidth * 1.5,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<template>
  <div class="food-ordering-system">
    <div class="current-placed-orders">
      <h2 id="cpoTitle">Current Placed Orders</h2>
      <div class="orders-container">
        <button class="scroll-button left" @click="scrollLeft">&lt;</button>
        <div class="orders-scroll" ref="ordersScroll">
          <div v-for="(order, index) in currentOrders" :key="index" class="order-box">
            <img :src="order.image" :alt="order.restaurant" class="order-image" />
            <div class="order-details">
              <p>{{ order.restaurant }}</p>
              <p>{{ order.dish }}</p>
              <p>{{ order.quantity }}</p>
              <button
                v-if="order.readyForCollection === 1"
                class="order-ready-btn"
                @click="updateORC(order)"
              >
                Order Ready. Collected?
              </button>
              <button v-else-if="order.preparingOrder" class="preparing-order-btn">
                Preparing Order
              </button>
              <button
                v-if="order.readyForCollection === 1"
                class="view-order-btn"
                @click="updateVON(order)"
              >
                View Order Number
              </button>
            </div>
          </div>
        </div>
        <div id="right-scroll">
          <button class="scroll-button right" @click="scrollRight">&gt;</button>
        </div>
      </div>
    </div>
    <!--<div class="new-order">
      <div class="new-order-circle">
        <span class="plus-sign">+</span>
      </div>
      <p>New Order</p>
    </div>-->
    <div>
      <img
        src="/NewOrderButton.png"
        alt="NewOrderButton"
        class="new-order"
        @click="goToDiningOptions"
      />
    </div>

    <!-- pull from backend past order [there are 2 that are collected already.]-->
    <div class="past-orders">
      <h2 id="past5OrdersTitle">Past 5 Orders</h2>
      <div class="past-orders-container">
        <div v-for="(order, index) in past5Orders" :key="index" class="past-order-box">
          <img :src="order.image" :alt="order.hawkerCentre" class="past-order-image" />
          <p class="past-order-restaurant">{{ order.hawkerCentre }}</p>
          <!--<h6 class="past-order-details">{{ order.merchantName }}</h6>
          <h6 class="past-order-details">{{ String(order.quantity + 'x ' + order.foodItemName) }}</h6>
          <h6 class="past-order-details">{{ "Add ons???" }}</h6>
          <h6 class="past-order-details">{{ "Special Instructions???" }}</h6>-->
          <button @click="quickOrder(order)" class="quick-order-btn">Quick Order</button>
        </div>
      </div>
    </div>

    <!-- Quick Order Popup -->
    <div v-if="showQuickOrderPopup" class="quick-order-popup">
      <div class="popup-content">
        <h3>Order Details</h3>
        <!--<p><strong>Order Number:</strong> {{ selectedOrder.orderNum }}</p>-->
        <p><strong>Hawker Centre:</strong> {{ selectedOrder.hawkerCentre }}</p>
        <p><strong>Merchant Name:</strong> {{ selectedOrder.merchantName }}</p>
        <p><strong>Food Item:</strong> {{ selectedOrder.foodItemName }}</p>
        <p><strong>Quantity:</strong> {{ selectedOrder.quantity }}</p>
        <strong>Add Ons:</strong>
        <p v-for="(addOn, index) in selectedOrder.addOns" :key="index">
          {{ addOn.quantity }}x {{ addOn.name }} - ${{ addOn.quantity * addOn.price.toFixed(2) }}
        </p>
        <!--<p><strong>Add Ons:</strong> {{ selectedOrder.addOns }}</p>-->
        <p><strong>Special Instructions:</strong> {{ selectedOrder.specialInstructions }}</p>
        <p><strong>Price:</strong> ${{ selectedOrder.foodItemPrice.toFixed(2) }}</p>
        <div class="popup-buttons">
          <button @click="closePopup" class="back-btn">Back</button>
          <button @click="continueOrder" class="continue-btn">Make New Order</button>
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
          <button @click="closeModal">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  width: 400px;
  padding: 30px;
  position: relative;
  z-index: 1010;
}

.modal-text h2 {
  margin-bottom: 10px;
  color: #00adb5;
  text-align: center;
  font-size: 35px;
}

.modal-text p {
  font-size: 18px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
  color: #00adb5;
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.modal-actions button {
  background-color: #00adb5;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  width: 60%;
  text-align: center;
  font-size: 15px;
}

.modal-actions button:hover {
  background-color: #007a80;
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

.food-ordering-system {
  position: relative;
  width: 100vw;
  height: 56.25vw; /* Aspect ratio 16:9 for the container */
  background-color: #ffffff;
  font-family: 'Inria Sans', sans-serif;
}

.current-placed-orders {
  position: absolute;
  top: 1vw; /* Adjusted top spacing for alignment */
  left: 3vw;
  width: 70vw;
  height: 20vw;
  border: 0.15vw;
  border-radius: 0.8vw;
  overflow: hidden; /* Hides the vertical scrollbar */
  font-family: 'Inria Sans', sans-serif;
}

#cpoTitle {
  color: black;
}

h2 {
  margin: 1vw 0; /* Adjusted to add more spacing */
  padding-left: 1.5vw; /* More padding to make the title visually aligned */
  color: #00adb5;
  font-size: 2vw; /* Increased size for more emphasis */
  font-weight: bold;
  font-family: 'Inria Sans', sans-serif;
}

.orders-container {
  position: relative;
  height: calc(100% - 4vw); /* Spacing between title and orders increased */
}

.orders-scroll {
  display: flex;
  overflow-x: hidden; /* Hide horizontal scroll by default */
  scroll-behavior: smooth;
  height: 100%;
  padding: 0 1vw;
  margin-left: 5vw;
  width: 59vw;
}

.order-box {
  flex: 0 0 auto;
  width: 10vw;
  height: 22.5vh;
  margin-right: 0.42vw;
  background-color: #393e46;
  border-radius: 0.42vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.42vw;
  color: #ffffff;
  box-shadow: 0 0.42vw 0.84vw rgba(0, 0, 0, 0.15);
  font-family: 'Inria Sans', sans-serif;
  border-radius: 20px;
  margin-top: 2vh;
}

.order-image {
  width: 8vw;
  height: 6vw;
  object-fit: cover;
  border-radius: 0.21vw;
}

.order-details {
  text-align: center;
}

.order-details p {
  margin: 0.3vw 0;
  font-size: 0.5vw;
}

button {
  border: none;
  border-radius: 0.21vw;
  padding: 0.21vw 0.42vw;
  margin-top: 0.21vw;
  cursor: pointer;
  font-size: 0.5vw;
  color: #ffffff;
}

/*button:hover {
  background-color: #007A80;
}*/

.order-ready-btn {
  background-color: #51e51c;
  color: black;
  height: 1.7vh;
  width: 8vw;
  font-size: 0.9vh;
  margin-top: 1vh;
  margin-bottom: 0.3vw;
  display: block;
}

.order-ready-btn:hover {
  background-color: #3cb516;
}

.preparing-order-btn {
  background-color: #d9d9d9;
  color: #000000;
  height: 4vh;
  width: 8vw;
  border-radius: 5px;
  font-size: 1.4vh;
  margin-bottom: 1vh;
}

.order-ready-btn:hover {
  background-color: #3cb516;
}

.view-order-btn {
  background-color: #00adb5;
  color: #ffffff;
  height: 1.7vh;
  width: 8vw;
  font-size: 0.9vh;
  margin-top: 0;
  display: block;
  margin-bottom: 1vh;
}

.view-order-btn:hover {
  background-color: #007a80;
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  color: black;
  border: none;
  border-radius: 50%;
  width: 3.75vw;
  height: 3.75vw;
  font-size: 4vw;
  font-weight: 200;
  cursor: pointer;
  z-index: 1;
}

.scroll-button.left {
  left: 1vw;
}

.scroll-button.right {
  right: 1vw;
}

.new-order {
  position: absolute;
  top: 2.5vw;
  right: 8vw;
  width: 14vw;
  height: 17vw;
  background-color: #00adb5;
  border-radius: 1vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.1);
}

.new-order p {
  font-size: 2vw;
  font-weight: 900;
  margin: 0;
}

.new-order-circle {
  width: 8vw;
  height: 8vw;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5vw;
}

.plus-sign {
  color: #00adb5;
  font-size: 8vw;
  font-weight: 600;
}

.new-order:hover {
  background-color: #007a80;
}

.past-orders {
  position: absolute;
  top: 22vw;
  left: 3vw;
  width: 94vw;
  height: 16vw;
}

#past5OrdersTitle {
  color: black;
}

.past-orders-container {
  display: flex;
  gap: 2vw;
  height: 100%;
}

.past-order-box {
  width: 14.4vw;
  height: 12.8vw;
  background-color: #ffffff;
  border-radius: 0.64vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.8vw;
  /*box-shadow: 0 0.16vw 0.32vw rgba(0, 0, 0, 0.1);*/
}

.past-order-image {
  width: 12.8vw;
  height: 8vw;
  object-fit: cover;
  border-radius: 0.32vw;
}

.past-order-restaurant {
  font-size: 0.8vw;
  font-weight: bold;
  margin: 0.4vw 0;
  text-align: center;
}

.past-order-details {
  font-size: 0.8vw;
  font-weight: normal;
  margin: 0.4vw 0;
  text-align: center;
}

.quick-order-btn {
  background-color: #00adb5;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 0.4vw 0.8vw;
  font-size: 0.64vw;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.quick-order-btn:hover {
  background-color: #007a80;
}

/* for quick order pop up */
.quick-order-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup-content {
  background: #ffffff;
  padding: 2vw;
  border-radius: 0.5vw;
  font-size: 1vw;
  width: 30vw;
  text-align: center;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2vw;
}

.continue-btn {
  background-color: #51e51c;
  color: #000000;
  padding: 1vw 2vw;
  font-size: 1vw;
  font-family: 'Inria Sans', sans-serif;
  border: none;
  cursor: pointer;
}

.back-btn {
  background-color: #e51c1c;
  color: #ffffff;
  padding: 1vw 2vw;
  font-size: 1vw;
  font-family: 'Inria Sans', sans-serif;
  border: none;
  cursor: pointer;
}

.continue-btn:hover {
  background-color: #6cff3a;
}

.back-btn:hover {
  background-color: #b51515;
}
</style>
