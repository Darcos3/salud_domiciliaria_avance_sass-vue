<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button router-Link="/historias-create" fill="solid" shape="round" size="small" color="primary" v-if="session.tipo == 0">
            <ion-icon :ios="add" :md="add"></ion-icon> Crear historia
          </ion-button>
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title><ion-icon :ios="bookmarksOutline" :md="bookmarksOutline"></ion-icon> Historias</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item v-for="h of historias" :key="h.id">
        <ion-thumbnail slot="start">
          <img src="../../../../public/img/logo2.png" v-if="h.imagen == null" class="img1" />
          <img :src='"http://sda_sas.test/storage/historias/" + h.imagen' v-if="h.imagen != null" class="img2" />
        </ion-thumbnail>
        <ion-label>
          <ion-button disabled color="success" size="small" v-if="h.firma == 1">Firmado</ion-button><br>
          <ion-button disabled color="danger" size="small" v-if="h.firma != 1">No Firmado</ion-button><br>
          <ion-text color="primary">Consecutivo No. {{ h.consecutivo }}</ion-text>
          <ion-card-title>Profesional: {{ h.profesional }}</ion-card-title>
          <ion-card-subtitle>Paciente: {{ h.paciente }}</ion-card-subtitle>
          <p>Fecha: {{ h.fecha }} - Hora: {{ h.hora }}</p>
          <hr>
          <ion-buttons class="button">
            <ion-button fill="outline" size="small" color="success" @click="firmar(h.id)"  v-if="session.tipo == 1">
              <ion-icon :md="checkmarkCircleOutline" :ios="checkmarkCircleOutline"></ion-icon>
            </ion-button>

            <ion-button fill="outline" size="small" color="warning" @click="modificar(h.id)"  v-if="session.tipo == 0">
              <ion-icon :md="createOutline" :ios="createOutline"></ion-icon>
            </ion-button>

            <ion-button button fill="outline" color="secondary" size="small" @click="detalles(h.id)">
              Ver detalles
            </ion-button>
          </ion-buttons>
        </ion-label>
      </ion-item><br>
    </ion-content>
  </ion-page>
</template>
  
<script>
import axios from 'axios';
import { Storage } from '@ionic/storage';
import { IonThumbnail, IonCardSubtitle, IonText, IonToolbar, IonButtons, IonMenuButton, IonHeader, IonTitle, IonIcon, IonContent, IonToast, IonPage, toastController, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel } from '@ionic/vue';
import { add, checkmarkCircleOutline, createOutline, bookmarksOutline } from 'ionicons/icons';

const store = new Storage();

export default {
  components: {
    IonThumbnail, IonCardSubtitle, IonText, IonToolbar, IonButtons, IonMenuButton, IonHeader, IonTitle, IonIcon, IonContent, IonPage, IonToast, IonCard, toastController, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel
  },
  data() {
    return {
      add,
      checkmarkCircleOutline,
      createOutline,
      bookmarksOutline,
      datos: {},
      historias:{},
      ruta: '',
      session: ''
    }
  },
  mounted() {
    this.setup();
    this.obtenerUsuario();
  },
  methods: {
    async setup() {
      await store.create();
    },
    async obtenerUsuario() {
      this.datos.usuario = await store.get('usuario');
      this.session = await store.get('session');

      console.log(this.session.tipo)
      this.obtenerHistorias(this.datos.usuario);
    },
    
    async obtenerHistorias() {
      await axios.post('http://sda_sas.test/api/apiObtenerHistorias', this.datos)
        .then(response => {
          let resp = response;
          // this.datos = {};
          if (resp.data.status === true) {
            console.log(resp.data.status)
            console.log(resp.data.historias)
            let message = 'Se han obtenido las historias del usuario!';
            let color = 'success';
            this.toast(color, message)

            this.historias = resp.data.historias;
          }
          else {
            let message = 'No se han encontrado historias registradas de este usuario!';
            let color = 'danger';
            this.toast(color, message)
          }
        })
        .catch(error => console.log(error))
    },

    firmar(id) {
      let history = {
        "historia": id
      };
      axios.post('http://sda_sas.test/api/apiFirmarHistoria', history)
        .then(response => {
          let resp = response;
          if (resp.data.status === true) {
            console.log(resp.data.status)
            console.log(resp.data.historias)
            let message = 'Se ha firmado la historia ' + id + '!';
            let color = 'success';
            this.toast(color, message)
            this.obtenerUsuario();
          }
          else {
            let message = 'No se pudo firmar la historia!';
            let color = 'danger';
            this.toast(color, message)
          }
        })
        .catch(error => console.log(error))
    },

    modificar(id){
      this.$router.push('/historias-update/'+id);
    },

    detalles(id){
      this.$router.push('/historias-detalles/'+id);
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
ion-item  {
    box-shadow: 0px 0px 1px 1px #222;
    margin-bottom: 10px;
    border-radius: 10px;
}

ion-card {
    box-shadow: inset 0px 0px 10px 0px #222;
    margin-bottom: 10px;
    border-radius: 10px;
}

ion-badge {
    position: relative;
    float: right;
    margin-bottom: 20px;
}

.icon-none {
    font-size: 10em;
}

.button {
    position: relative;
    float: right;
    margin-bottom: 20px;
}

.img1 {
    width: 200px;
    height: 67px;
    margin-top: -30px;
}

.img2 {
    width: 80px;
    margin-top: -30px;
}

</style>
  