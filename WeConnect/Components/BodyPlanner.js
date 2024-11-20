const {useVuelidate} = Vuelidate;
const {required, email} = VuelidateValidators;


//const {QrcodeCanvas, QrcodeSvg }=QrcodeVue;

vueapp.component('BodyComponent', {
    setup() {
        return {
            v$: useVuelidate()
        }
    },
    mounted:function(){
      if(MyStorage.Data.Module1.length>0){
        this.qrurl=MyStorage.Data.Module1[0].link;
      }
      
    },
    data() {
      return {
          qrurl: "---",
          m:"Module1",
          Storage:MyStorage
      }
    },
    components: {
        QrcodeCanvas: QrcodeVue.QrcodeCanvas,
        QrcodeSvg: QrcodeVue.QrcodeSvg,
      },
          
    template: `
    
    <span>{{qrurl}}</span>
    <div>
    <ul>
    <li v-for="item in Storage.Data.Module1">
  {{ item.title }}
   <qrcode-svg :value="item.link" level="H"></qrcode-svg>
</li>
    </ul>
    
   </div>
    `
  });