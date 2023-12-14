<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="img-logos ion-text-center">
        <ion-img :src="logo" class="logo"></ion-img>
        <ion-img :src="avancesas" class="as"></ion-img><br>
      </div>
      <ion-card>
        <ion-card-header class="ion-text-center">
          <ion-item button class="ion-text-left ion-text-info" router-Link="/login">
            <ion-icon :ios="arrowBack" :md="arrowBack"></ion-icon> Regresar al login
          </ion-item>
          <ion-card-title>Crear Usuario</ion-card-title>
          <ion-card-subtitle>Por favor complete el formulario con sus datos de usuario y sus datos de perfil, para poder
            crear su usuario</ion-card-subtitle>
        </ion-card-header><hr>

        <ion-card-content>
          <ion-label>Tipo de usuario</ion-label>
          <ion-item>
            <ion-select value="" placeholder="Seleccione el tipo de usuario" mode="ios" v-model="datos.tipo" required>
              <ion-select-option :value="0">Profesional</ion-select-option>
              <ion-select-option :value="1">Paciente</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item><br>
            <ion-label position="floating">Número de identificacion</ion-label>
            <ion-input type="number" required v-model="datos.num_identificacion"></ion-input>
          </ion-item><br>

          <ion-item>
            <ion-label position="floating">Nombre</ion-label>
            <ion-input type="text" required v-model="datos.nombre"></ion-input>
          </ion-item><br>
          <ion-item>
            <ion-label position="floating">Apellidos</ion-label>
            <ion-input type="text" required v-model="datos.apellidos"></ion-input>
          </ion-item><br>
          <ion-item>
            <ion-label position="floating">Correo electrónico</ion-label>
            <ion-input type="email" required v-model="datos.correo_electronico"></ion-input>
          </ion-item><br>
          <ion-item>
            <ion-label position="floating">Número de celular</ion-label>
            <ion-input type="tel" required v-model="datos.num_celular"></ion-input>
          </ion-item><br>
          <ion-item>
            <ion-label position="floating">Ubicación</ion-label>
            <ion-input type="text" required v-model="datos.ubicacion"></ion-input>
          </ion-item>
          <ion-button button color="primary" expand="block" shape="round" class="ion-text-center rounded" 
            @click="crear">
            Crear Usuario
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
  
<script>
import axios from 'axios';
import { Storage } from '@ionic/storage';
import {IonImg, IonIcon, IonContent, IonToast, IonPage, toastController, IonCard, IonCardSubtitle, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';

const store = new Storage();

export default {
  components: {
    IonImg, IonIcon, IonContent, IonPage, IonToast, IonCard, toastController, IonCardSubtitle, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel
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

    option(){
      this.datos.tipo = this.datos.tipo
    },

    crear() {
      axios.post('http://sda_sas.test/api/apiRegistrar', this.datos)
        .then(response => {
          let resp = response;
          this.datos = {};
          if (resp.data.status === true) {
            console.log(resp.data)
            let message = 'Ha creado satisfactoriamente su usuario, ahora puede iniciar sesion!';
            let color = 'success';
            this.toast(color, message)
            this.$router.push('/login', 'root')
          }
          else {
            let message = 'No se ha podido crear el usuario, por favor verifique el formulario e intente nuevamente!';
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
  margin-top: 10%;
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
  