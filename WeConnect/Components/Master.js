
// const {useVuelidate} = Vuelidate;
// const {required, email} = VuelidateValidators;
 const {createApp, ref} = Vue;

 const {createVuetify} = Vuetify;

 const vuetify = createVuetify();

 const {QrcodeCanvas, QrcodeSvg }=QrcodeVue;
 //const QrcodeVue=QrcodeVue.default;
//Vue.use(BootstrapVue);

 vueapp =createApp({
  components: {
    QrcodeCanvas: QrcodeVue.QrcodeCanvas,
    QrcodeSvg: QrcodeVue.QrcodeSvg,
  },
    
    template: `
    <v-layout ref="app" class="rounded rounded-md">
    <HeaderComponenet></HeaderComponenet>
    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
    
    <BodyComponent></BodyComponent>
    </v-main>
    <v-footer
    name="footer"
    app
  >
   
    <FooterCompenent></FooterCompenent>
    </v-footer>
    </v-layout>
    `
});
//vueapp.use(vuetify).mount('#app')