<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center">Actualizar historia No {{ this.$route.params.id }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button routerLink="/historias">
            <ion-icon slot="start" :md="arrowBack" :ios="arrowBack"></ion-icon>
            Ver Historias
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-for="h of history">
      <ion-card>
        <ion-item>
          <ion-thumbnail slot="start">
            <img :src="logo2" v-if="h.imagen == null" class="img1" />
            <img :src='"http://sda_sas.test/storage/historias/" + h.imagen' v-if="h.imagen != null" class="img2" />
          </ion-thumbnail>
          <ion-label>Imagen de la visita al paciente</ion-label>
        </ion-item>
        <ion-card-header>
          <ion-card-title color="primary">Datos Generales</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item class="ion-text-rigth">
            <ion-label position="fixed">Paciente</ion-label>
            <p slot="end">{{ h.paciente }}</p>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Consecutivo</ion-label>
            <p slot="end">{{ h.consecutivo }}</p>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Fecha</ion-label>
            <p slot="end">{{ h.fecha }}</p>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Hora</ion-label>
            <p slot="end">{{ h.hora }}</p>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Profesional</ion-label>
            <p slot="end">{{ h.profesional }}</p>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title color="primary">Datos del Paciente</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-label>Evolución final</ion-label>
          <ion-item>
            <ion-textarea v-model="datos.evolucion_final"></ion-textarea>
          </ion-item><br>
          <ion-label>Informacion Relevante</ion-label>
          <ion-item>
            <ion-textarea v-model="datos.inf_relevante" required></ion-textarea>
          </ion-item><br>
          <ion-label>Concepto Profesional</ion-label>
          <ion-item>
            <ion-textarea v-model="datos.concepto_profesional" required></ion-textarea>
          </ion-item><br>
          <ion-label>Antecedentes del Paciente</ion-label>
          <ion-item>
            <ion-textarea v-model="datos.inf_antecedentes" required></ion-textarea>
          </ion-item><br>
          <ion-label>Recomendaciones al Paciente</ion-label>
          <ion-item lines="true">
            <ion-textarea v-model="datos.recomendaciones" required></ion-textarea>
          </ion-item><br>
          <input type="file" accept="image/*;capture=camera"><br><br>
          <ion-button expand="block" fill="solid" shape="round" color="primary" @click="modificar" 
            :disabled="!datos.evolucion_final || !datos.inf_relevante || !datos.concepto_profesional || !datos.inf_antecedentes || !datos.recomendaciones">
            Actualizar historia
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
import { IonThumbnail, IonTextarea, IonCardSubtitle, IonText, IonToolbar, IonButtons, IonMenuButton, IonHeader, IonTitle, IonIcon, IonContent, IonToast, IonPage, toastController, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel } from '@ionic/vue';
import { add, arrowBack, checkmarkCircleOutline, createOutline } from 'ionicons/icons';

const store = new Storage();

export default {
  components: {
    IonThumbnail, IonTextarea, IonCardSubtitle, IonText, IonToolbar, IonButtons, IonMenuButton, IonHeader, IonTitle, IonIcon, IonContent, IonPage, IonToast, IonCard, toastController, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel
  },
  data() {
    return {
      add,
      arrowBack,
      checkmarkCircleOutline,
      createOutline,
      datos: {},
      historia: {},
      currentImage: null,
      logo2:null
    }
  },
  mounted() {
    this.setup();
    this.obtenerHistoria()
  },
  methods: {
    async setup() {
      await store.create();
      this.logo2 = 'img/logo2.png';
    },

    obtenerHistoria() {
      let id = {
        "historia": this.$route.params.id
      }

      axios.post('http://sda_sas.test/api/apiObtenerHistoria', id)
        .then(response => {
          let resp = response;
          this.datos = {};
          console.log(resp.data.historia)
          if (resp.data.status === true) {
            console.log(resp.data.status)
            let message = 'Se han obtenido las historia No ' + history.historia;
            let color = 'success';
            this.toast(color, message)

            this.history = resp.data.historia;

            this.datos.historia = this.history[0].id;
            this.datos.fecha = this.history[0].fecha;
            this.datos.hora = this.history[0].hora;
            this.datos.evolucion_final = this.history[0].evolucion_final;
            this.datos.inf_relevante = this.history[0].inf_relevante;
            this.datos.concepto_profesional = this.history[0].concepto_profesional;
            this.datos.inf_antecedentes = this.history[0].inf_antecedentes;
            this.datos.recomendaciones = this.history[0].recomendaciones;
          }
          else {
            let message = 'No se ha encontrado la historia!';
            let color = 'danger';
            this.toast(color, message)
          }
        })
        .catch(error => console.log(error))
    },

    async takePicture() {
      let image = await Plugins.Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.base64
      });
      console.log(image)
      this.datos.currentImage = image;
    },

    modificar() {
      axios.post('http://sda_sas.test/api/apiUpdateHistoria', this.datos)
        .then(response => {
          let resp = response;
          if (resp.data.status === true) {
            console.log(resp.data)
            let message = 'Se han actualizado las historia No ' + this.datos.historia;
            let color = 'success';
            this.toast(color, message)
            this.$router.push('/historias');
          }
          else {
            let message = 'No se ha podido actualizar la historia, vuelve a intentarlo!';
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
p {
  text-align: right !important;
}
</style>
  