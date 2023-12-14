<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="img-logos ion-text-center">
        <ion-img :src="logo" class="logo"></ion-img>
        <ion-img :src="avancesas" class="as"></ion-img><br>
      </div>
      <ion-card>
        <ion-card-header class="ion-text-center">
          <ion-card-title>Inicio de Sesión</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-label>Tipo de usuario</ion-label>
          <ion-item>
            <ion-select required placeholder="Seleccione el tipo de usuario" mode="ios" v-model="datos.tipo">
              <ion-select-option value="0">Profesional</ion-select-option>
              <ion-select-option value="1">Paciente</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item><br>
            <ion-label position="floating">Número de identificacion</ion-label>
            <ion-input type="number" required v-model="datos.num_identificacion"></ion-input>
          </ion-item><br>
          <ion-item>
            <ion-label position="floating">Contraseña</ion-label>
            <ion-input type="password" required v-model="datos.password"></ion-input>
          </ion-item><br>
          <ion-button expand="block" fill="solid" shape="round" @click="login">
            iniciar sesión
          </ion-button>
          <ion-item class="ion-text-center">
            <ion-label color="medium">---- ¿Aún no tienes cuenta? ----</ion-label>
          </ion-item>
          <ion-item button class="ion-text-center ion-text-capitalize rounded" color="dark" router-link="/registro">
            <ion-label color="medium">registrate como usuario</ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>
  
<script>
import axios from 'axios';
import { Storage } from '@ionic/storage';
import { IonImg, IonContent, IonToast, IonPage, toastController, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel } from '@ionic/vue';
import { defineComponent, computed } from 'vue'
const store = new Storage();



export default {
  components: {
    IonImg, IonContent, IonPage, IonToast, IonCard, toastController, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel
  },
  data() {
    return {
      datos: {},
      keyUser: "usuario",
      keyToken: "token",
      keySession: "session",
      logo: null,
      avancesas: null
    }
  },
  mounted() {
    this.setup();
  },
  methods: {
    async setup() {
      await store.create();

      this.logo = 'img/logo.png';
      this.avancesas = 'img/as.png';
    },

    login() {
      axios.post('http://sda_sas.test/api/apiLoginPost', this.datos)
        .then(response => {
          let resp = response;
          this.datos = {};
          if (resp.data.status === true) {
            console.log(resp.data.status)
            let message = 'Ha ingresado satisfactoriamente, sus datos de sesión serán guardados!';
            let color = 'success';
            this.toast(color, message)
            this.guardarStorage(this.keyUser, resp.data.usuario.id);
            this.guardarStorage(this.keySession, resp.data.usuario);
            this.guardarStorage(this.keyToken, resp.data.token);

            if (resp.data.usuario.estado == 0) {
              this.$router.push('/update-password', 'root');
            } else {
              this.$router.push('/historias', 'root');
            }
          }
          else {
            let message = 'Ha ingresado equivocadamente los datos, por favor vuelva a intentarlo!';
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
  