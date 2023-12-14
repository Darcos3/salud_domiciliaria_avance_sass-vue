<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title class="ion-text-center">Detalles de la historia No {{ this.$route.params.id }}</ion-title>
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
                        <img :src='"http://sda_sas.test/storage/historias/" + h.imagen' v-if="h.imagen != null"
                            class="img2" />
                    </ion-thumbnail>
                    <ion-label>Imagen de la visita al paciente</ion-label>
                </ion-item>
                <ion-card-header>
                    <ion-card-title color="primary">Datos Generales</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-item class="ion-text-rigth">
                        <ion-label position="fixed">Paciente</ion-label><br>
                        <p slot="end">{{ h.paciente }}</p>
                    </ion-item>
                    <ion-item>
                        <ion-label position="fixed">Consecutivo</ion-label><br>
                        <p slot="end">{{ h.consecutivo }}</p>
                    </ion-item>
                    <ion-item>
                        <ion-label position="fixed">Fecha</ion-label><br>
                        <p slot="end">{{ h.fecha }}</p>
                    </ion-item>
                    <ion-item>
                        <ion-label position="fixed">Hora</ion-label><br>
                        <p slot="end">{{ h.hora }}</p>
                    </ion-item>
                    <ion-item>
                        <ion-label position="fixed">Profesional</ion-label><br>
                        <p slot="end">{{ h.profesional }}</p>
                    </ion-item>
                </ion-card-content>
            </ion-card>

            <ion-card>
                <ion-card-header>
                    <ion-card-title color="primary">Datos del Paciente</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-label>Evolución final</ion-label><br>
                    <ion-item>
                        <p>{{ h.evolucion_final }}</p>
                    </ion-item>
                    <ion-label>Informacion Relevante</ion-label><br>
                    <ion-item>
                        <p>{{ h.inf_relevante }}</p>
                    </ion-item><br>
                    <ion-label>Concepto Profesional</ion-label><br>
                    <ion-item>
                        <p>{{ h.concepto_profesional }}</p>
                    </ion-item><br>
                    <ion-label>Antecedentes del Paciente</ion-label><br>
                    <ion-item>
                        <p>{{ h.inf_antecedentes }}</p>
                    </ion-item><br>
                    <ion-label>Recomendaciones al Paciente</ion-label><br>
                    <ion-item lines="true">
                        <p>{{ h.recomendaciones }}</p>
                    </ion-item><br>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>
    
<script>
import axios from 'axios';
import { IonThumbnail, IonTextarea, IonCardSubtitle, IonText, IonToolbar, IonButtons, IonMenuButton, IonHeader, IonTitle, IonIcon, IonContent, IonToast, IonPage, toastController, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonItem, IonButton, IonInput, IonLabel } from '@ionic/vue';
import { add, arrowBack, checkmarkCircleOutline, createOutline } from 'ionicons/icons';

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
            history: {},
            logo2:null
        }
    },
    mounted() {
        this.setup();
        this.obtenerHistoria();
    },
    methods: {
        setup(){
            this.logo2 = 'img/logo2.png';
        },

        obtenerHistoria() {
            let id = {
                "historia": this.$route.params.id
            }

            axios.post('http://sda_sas.test/api/apiObtenerHistoria', id)
                .then(response => {
                    let resp = response;
                    this.history = {};
                    if (resp.data.status === true) {
                        this.history = resp.data.historia;
                    }
                })
                .catch(error => console.log(error))
        },
    }

}
</script>
    
<style scoped>
p {
    text-align: justify !important;
}
</style>
    