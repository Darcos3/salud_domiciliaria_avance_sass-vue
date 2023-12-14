<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center">Crear historia</ion-title>
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

    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title color="primary">Datos Generales</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="fixed">Seleccione un paciente</ion-label>
            <ion-select value="" placeholder="Seleccione" mode="ios" v-model="datos.num_identificacion"
              @ion-change="seleccionarPaciente">
              <ion-select-option v-for="p of pacientes" :value="p.num_identificacion">{{ p.paciente }}</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Consecutivo</ion-label>
            <ion-input type="number" readonly="true" v-model="datos.consecutivo"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Fecha</ion-label>
            <ion-input type="date" required v-model="datos.fecha"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Hora</ion-label>
            <ion-input type="time" required v-model="datos.hora"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Profesional</ion-label>
            <ion-input type="text" required v-model="datos.profesional" readonly="true"></ion-input>
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
            <ion-textarea v-model="datos.evolucion_final" required></ion-textarea>
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
          <ion-input type="file" accept="image/png;image/jpeg;capture=camera" @change="createImage"></ion-input><br><br>
          <ion-button expand="block" fill="solid" shape="round" color="primary" @click="crear"
            :disabled="!datos.num_identificacion || !datos.consecutivo || !datos.fecha || !datos.hora || !datos.evolucion_final || !datos.inf_relevante || !datos.concepto_profesional || !datos.inf_antecedentes || !datos.recomendaciones">
            Crear historia
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
      pacientes: {}
    }
  },
  mounted() {
    this.setup();
    this.obtenerPacientes();
    this.obtenerUsuario();
  },
  methods: {
    async setup() {
      await store.create();
    },
    
    async obtenerUsuario() {
      this.datos.id_profesional = await store.get('usuario');
      this.obtenerProfesional(this.datos.id_profesional);
    },

    obtenerProfesional(id) {
      let array = {
        "usuario": id
      }

      axios.post('http://sda_sas.test/api/apiObtenerUsuario', array)
        .then(response => {
          let resp = response;
          this.datos.profesional = resp.data.rol.nombre + ' ' + resp.data.rol.apellidos;
          console.log("PROFESIONAL ", this.datos.profesional)
        })
        .catch(error => console.log(error))
    },

    obtenerPacientes() {
      axios.post('http://sda_sas.test/api/apiObtenerPacientes')
        .then(response => {
          let resp = response;
          this.pacientes = resp.data.pacientes;
        })
        .catch(error => console.log(error))
    },

    seleccionarPaciente() {
      let array = {
        "num_identificacion": this.datos.num_identificacion
      }

      axios.post('http://sda_sas.test/api/apiObtenerConsecutivo', array)
        .then(response => {
          let resp = response;
          this.datos.consecutivo = resp.data.consecutivo;
          this.datos.id_paciente = resp.data.id;
        })
        .catch(error => console.log(error))

      console.log(this.datos.num_identificacion)
    },

    createImage() {
      let rawImg;
      const file = document.querySelector('input[type=file]').files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        rawImg = reader.result;
        // console.log(rawImg);
        this.datos.imagen = rawImg;
      }
      reader.readAsDataURL(file);
    },

    crear() {
      // console.log(this.datos);

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      axios.post('http://sda_sas.test/api/apiCrearHistoria', this.datos, config)
        .then(response => {
          let resp = response;
          if (resp.data.status === true) {
            let message = 'Se ha creado una nueva historia';
            let color = 'success';
            this.toast(color, message)
            this.$router.push('/historias', 'root');
          }
          else {
            let message = 'No se ha podido crear la historia!';
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
  