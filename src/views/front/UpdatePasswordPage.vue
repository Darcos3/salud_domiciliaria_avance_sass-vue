<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="img-logos ion-text-center">
        <ion-img :src="logo" class="logo"></ion-img>
        <ion-img :src="avancesas" class="as"></ion-img><br>
      </div>
      <ion-card>
        <ion-card-header class="ion-text-center">
          <ion-item button class="ion-text-left ion-text-info" router-Link="/login">
            <ion-icon :ios="arrowBack" :md="arrowBack"></ion-icon> Regresar al login
          </ion-item>
          <ion-card-title>Actualización de Contraseña</ion-card-title>
          <ion-card-subtitle>Por favor complete el formulario con su contraseña para poder actualizar sus datos de acceso
            al sistema</ion-card-subtitle>
        </ion-card-header>
        <hr>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Contraseña</ion-label>
            <ion-input type="password" required v-model="datos.password"></ion-input>
          </ion-item><br>
          <ion-item>
            <ion-label position="floating">Confirmar Contraseña</ion-label>
            <ion-input type="password" required v-model="datos.conpassword" @ion-change="validar"></ion-input>
          </ion-item><br>
          <ion-button expand="block" fill="solid" shape="round" @click=updatepassword>
            Actualizar Contraseña
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
  
<script>
import axios from 'axios';
import { Storage } from '@ionic/storage';
import { IonIcon, IonContent, IonToast, IonPage, toastController, IonCard, IonCardSubtitle, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';

const store = new Storage();

export default {
  components: {
    IonIcon, IonContent, IonPage, IonToast, IonCard, toastController, IonCardSubtitle, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel
  },
  data() {
    return {
      arrowBack,
      datos: {},
      logo:null,
      avancesas:null
    }
  },
  mounted() {
    this.setup();
    this.obtenerUsuario();
  },
  methods: {
    async setup() {
      await store.create();
      this.logo = 'img/logo.png';
      this.avancesas = 'img/as.png';
    },

    async obtenerUsuario() {
      this.datos.usuario = await store.get('usuario');
    },

    validar() {
      if (this.datos.password == this.datos.conpassword) {
        let message = 'Las contraseñas son iguales, ahora por favor seleccione el boton para poder guardar los cambios!';
        let color = 'success';
        this.toast(color, message)
      }
      else {
        let message = 'Las contraseñas deben ser iguales, por favor verifique e intente nuevamente!';
        let color = 'warning';
        this.toast(color, message)
      }
    },

    updatepassword() {
      axios.post('http://sda_sas.test/api/apiGuardarPassword', this.datos)
        .then(response => {
          let resp = response;
          // this.datos = {};
          if (resp.data.status === true) {
            console.log(resp.data)
            let message = 'Ha actualizado la contraseña satisfactoriamente, ahora puede continuar!';
            let color = 'success';
            this.toast(color, message)
            this.EliminarStorage('session');  
            this.guardarStorage('session', resp.data.usuario);
            this.$router.push('/historias')
          }
          else {
            let message = 'No se ha podido actualizar su contraseña, por favor verifique!';
            let color = 'danger';
            this.toast(color, message)
          }
        })
        .catch(error => console.log(error))
    },

    async toast(color, message) {
      const toast = await toastController.create({
        message: message,
        duration: 2500,
        position: 'bottom',
        color: color
      });
      await toast.present();
    },

    async guardarStorage(key, datos) {
      await store.set(key, datos);
    },

    async EliminarStorage(key) {
      await store.remove(key);
    }
  }

}


</script>
  
<style scoped>
ion-content {
  --background: url('img/bg-login.png') !important;
  --background-size: cover !important;
}

.img-logos {
  text-align: center !important;
  background: #fff;
  width: 200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30%;
  margin-bottom: -95px;
  border-radius: 10% 10% 10px 10px;
  box-shadow: inset 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
}

ion-card {
  margin-top: 20%;
}

.logo {
  width: 180px;
  height: auto;
  /* display: block; */
  /* margin: 0 auto; */
  margin-top: -33px;
}

.as {
  width: 80px;
  height: auto;
  display: block;
  margin: 0 auto;
  margin-top: -30px;
}

ion-label {
  margin: 0 auto;
}

.rounded {
  border-radius: 10px;
}
</style>
  