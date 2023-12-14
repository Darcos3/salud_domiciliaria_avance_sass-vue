<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title><ion-icon :ios="settingsOutline" :md="settingsOutline"></ion-icon> Configuración</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card>
      <ion-card-header>
        <p class="ion-text-justify">Si deseas puedes modificar los datos del formulario, y seleccionar el boton para poder actualizar tu usuario</p>
        <ion-card-title color="primary">Datos de usuario</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-label position="floating">Número de identificación</ion-label>
          <ion-input type="text" v-model="datos.num_identificacion" readonly></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Nombre de usuario</ion-label>
          <ion-input type="text" v-model="datos.nombre_usuario" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Correo electrónico</ion-label>
          <ion-input type="email" v-model="datos.correo_electronico" required></ion-input>
        </ion-item>
      </ion-card-content>
    </ion-card>
    <ion-card>
      <ion-card-header>
        <ion-card-title color="primary">Datos de perfil</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-label position="floating">Nombre</ion-label>
          <ion-input type="text" v-model="datos.nombre" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Apellidos</ion-label>
          <ion-input type="text" v-model="datos.apellidos" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Número de celular</ion-label>
          <ion-input type="tel" v-model="datos.num_celular" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Ubicación</ion-label>
          <ion-input type="text" v-model="datos.ubicacion" required></ion-input>
        </ion-item>
        <ion-button expand="block" fill="solid" color="primary" shape="round" @click="modificar"
        :disabled="!datos.nombre_usuario || !datos.correo_electronico || !datos.nombre || !datos.apellidos || !datos.num_celular || !datos.ubicacion"
        >
          Actualizar perfil
        </ion-button>
      </ion-card-content>
    </ion-card>
    </ion-content>
  </ion-page>
</template>
  
<script>
import axios from 'axios';
import { Storage } from '@ionic/storage';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonSegment, IonSegmentButton, IonThumbnail, IonTextarea, IonCardSubtitle, IonText, IonToolbar, IonButtons, IonMenuButton, IonHeader, IonTitle, IonIcon, IonContent, IonToast, IonPage, toastController, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel } from '@ionic/vue';
import { add, arrowBack, checkmarkCircleOutline, createOutline, settingsOutline } from 'ionicons/icons';

const store = new Storage();

export default {
  components: {
    IonSegment, IonSegmentButton, IonThumbnail, IonTextarea, IonCardSubtitle, IonText, IonToolbar, IonButtons, IonMenuButton, IonHeader, IonTitle, IonIcon, IonContent, IonPage, IonToast, IonCard, toastController, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel
  },
  data() {
    return {
      add,
      arrowBack,
      checkmarkCircleOutline,
      createOutline,
      settingsOutline,
      datos: {},
      tipo: 0,
      currentImage: null
    }
  },
  mounted() {
    this.setup();
    this.obtenerUsuario()
  },
  methods: {
    async setup() {
      await store.create();
    },
    
    async obtenerUsuario(){
      this.datos.id = await store.get('usuario');
      this.obtenerPerfil(this.datos.id);
    },

    obtenerPerfil(id){
      let array = {
        "usuario": id
      }

      axios.post('http://sda_sas.test/api/apiObtenerUsuario', array)
        .then(response => {
          let resp = response;
          console.log(resp)
          this.datos.num_identificacion = resp.data.usuario.num_identificacion;
          this.datos.nombre_usuario = resp.data.usuario.usuario;
          this.datos.correo_electronico = resp.data.usuario.correo_electronico;
          this.datos.nombre = resp.data.rol.nombre;
          this.datos.apellidos = resp.data.rol.apellidos;
          this.datos.num_celular = resp.data.rol.num_celular;
          this.datos.ubicacion = resp.data.rol.ubicacion;
        })
        .catch(error => console.log(error))
    },

    modificar() {
      axios.post('http://sda_sas.test/api/apiUpdate', this.datos)
        .then(response => {
          let resp = response;
          if (resp.data.status === true) {
            console.log(resp.data)
            let message = 'Se han actualizado su perfil';
            let color = 'success';
            this.toast(color, message)
            this.$router.push('/configuracion');
          }
          else {
            let message = 'No se ha podido actualizar su perfil, vuelvalo a intentar!';
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

  }

}
</script>
  
<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
  