import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

// import  OneSignal  from 'onesignal-cordova-plugin';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';


import OneSignal from 'onesignal-cordova-plugin';

function OneSignalInit() {
  const IdKey = "2b570b2d-493d-4bcc-a2c8-54595cdd3ee8";
  OneSignal.initialize("2b570b2d-493d-4bcc-a2c8-54595cdd3ee8");


  let myClickListener = async function (event) {
    let notificationData = JSON.stringify(event);
  };
  OneSignal.Notifications.addEventListener("click", myClickListener);


  // Prompts the user for notification permissions.
  //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
  OneSignal.Notifications.requestPermission(true).then((accepted) => {
    console.log("User accepted notifications: " + accepted);
  });
}

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(OneSignal);

router.isReady().then(() => {
  app.mount('#app');
  document.addEventListener("deviceready", OneSignalInit, false);
});