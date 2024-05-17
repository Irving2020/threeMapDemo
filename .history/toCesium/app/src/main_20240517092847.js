import Vue from 'vue'
import App from './App.vue'
import { Ion } from 'cesium'

Vue.config.productionTip = false

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYmYwMDRlZS1iMDZiLTQ3NTktYTgyYi03M2JhMTIwZmJlOTciLCJpZCI6MzU2NDAsImlhdCI6MTY1ODI5NDYzMH0.Bi7SRpVgLbym0c0SXQhpM1a57mQtRV-waLb14PUkei8"

new Vue({
  render: h => h(App),
}).$mount('#app')
