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
      //this.Storage=MyStorage;
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
      methods:{
        addItem(){
          this.Storage.addItem(this.m,{title:"",link:'',type:"linkedin"});
          this.Storage.Data.Module1.push({title:"",link:'',type:"linkedin"})
        },
        removeItem(index){
          this.Storage.deleteItem(this.m,this.Storage.Data.Module1[index]);
          this.Storage.Data.Module1.splice(index, 1)
        },
            },
            validations () {
              return {
                title: { required }, // Matches this.firstName
                lastName: { required }, // Matches this.lastName
                 
              }
            },
    template: `
    
    <span>{{qrurl}}</span>
    <div>
    <div class="col-md-12">
        <div class="form-group" :class="{ error: v$.title.$errors.length }">
          <label>Internal FAQ</label>
          <v-btn append-icon="home" @click="addItem"> Add </v-btn>
          <ul class="internalFaq">
            <li v-for="(item, index)  in Storage.Data.Module1"  :key="id">
              <input  type="text" class="form-control"  aria-describedby="title"  v-model="item.title"/>
              <input  type="text" class="form-control"  aria-describedby="link"  v-model="item.link"/>
              <v-btn append-icon="$minus" @click="removeItem(index)"> Remove </v-btn>
              </li>
  
            </ul>
          </div>
        </div>
       
    <ul>
    <li v-for="item in Storage.Data.Module1">
  {{ item.title }}
   <qrcode-svg :value="item.link" level="H"></qrcode-svg>
</li>
    </ul>

    
   </div>
    `
  });