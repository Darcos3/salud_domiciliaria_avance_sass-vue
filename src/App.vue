<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-img :src="logo"></ion-img>
            <ion-img :src="avancesas" class="as"></ion-img>
            <div class="info">
              <ion-text class="ion-text-capitalize" color="dark">{{ usuario }}</ion-text><br>
              <ion-note v-if="tipo == '0'">Profesional</ion-note>
              <ion-note v-if="tipo == '1'">Paciente</ion-note>
            </div>

            <ion-menu-toggle :auto-hide="false">
              <ion-item router-link="/historias" router-direction="root" lines="true" :detail="false" class="hydrated">
                <ion-icon aria-hidden="true" slot="start" :ios="bookmarkOutline" :md="bookmarkOutline"> </ion-icon>
                <ion-label>Historias</ion-label>
              </ion-item>
              <ion-item router-link="/configuracion" router-direction="root" lines="true" :detail="false"
                class="hydrated">
                <ion-icon aria-hidden="true" slot="start" :ios="settingsOutline" :md="settingsOutline"> </ion-icon>
                <ion-label>Configuracion</ion-label>
              </ion-item>
              <ion-item @click="cerraresion" lines="true" :detail="false" class="hydrated">
                <ion-icon aria-hidden="true" slot="start" :ios="logOutOutline" :md="logOutOutline" color="danger">
                </ion-icon>
                <ion-label color="danger">Cerrar Sesión</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script>
import { IonImg, IonText, IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonNote, IonRouterOutlet, IonSplitPane } from '@ionic/vue';
import { ref } from 'vue';

import { Storage } from '@ionic/storage';
import { bookmarkOutline, logOutOutline, settingsOutline } from 'ionicons/icons';

const store = new Storage();

export default {
  components: {
    IonImg, IonText, IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonNote, IonRouterOutlet, IonSplitPane
  },
  data() {
    return {
      bookmarkOutline, logOutOutline, settingsOutline,
      datos: {},
      tipo: null,
      usuario: null,
      logo: null,
      avancesas: null,
    }
  },
  async mounted() {
    this.setup();
    this.obtnerSesion();
    

  },
  methods: {
    async setup() {
      await store.create();

      this.logo = 'img/logo.png';
      this.avancesas = 'img/as.png';
    },

    async obtnerSesion() {
      this.datos.sesion = await store.get('session');
      this.tipo = this.datos.sesion.tipo;
      this.usuario = this.datos.sesion.usuario;


      if (this.datos.sesion != undefined) {
        if (this.datos.sesion.estado == 0) {
          this.$router.push('/update-password', 'root');
        }
        else {
          this.$router.push('/historias', 'root');
        }
      }
      else {
      }
    },

    async cerraresion() {
      await store.clear();
      this.$router.push('/login', 'root');
    }
  }
}

</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}


.as {
  width: 120px;
  margin: 0 auto;
  margin-top: -60px;
}

.info {
  text-align: center !important;
}
</style>
