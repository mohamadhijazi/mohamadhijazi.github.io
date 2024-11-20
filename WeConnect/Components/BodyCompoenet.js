const {useVuelidate} = Vuelidate;
const {required, email} = VuelidateValidators;


//const {QrcodeCanvas, QrcodeSvg }=QrcodeVue;

vueapp.component('BodyComponent', {
    setup() {
        return {
            v$: useVuelidate()
        }
    },
    components: {
        QrcodeCanvas: QrcodeVue.QrcodeCanvas,
        QrcodeSvg: QrcodeVue.QrcodeSvg,
      },
          
    template: `
    <div style="    margin: 20px;">
    <qrcode-canvas :value="'https://linkedin.com/in/moehijazi'" level="H"></qrcode-canvas>
    </div>
    
    <div>
    <qrcode-svg :value="'google.com'" level="H"></qrcode-svg>
   </div>
    `
  });