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
      console.log("hi");
      console.log(localStorage.Module1);
      //this.Storage=MyStorage;
    },
    watch: {
      Storage: {
        handler(val, oldVal) {
         // console.log('book list changed')
          this.Storage.bulkUpdate(this.m);
        },
        deep: true
      },
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
         // this.Storage.addItem(this.m,{title:"",link:'',type:"linkedin"});
          this.Storage.Data.Module1.push({title:"",link:'',type:"linkedin",id:this.Storage.Data.Module1.length});
        },
        removeItem(index){
        //  this.Storage.deleteItem(this.m,this.Storage.Data.Module1[index]);
          this.Storage.Data.Module1.splice(index, 1);
        },
            },
            validations () {
              return {
                title: { required }, // Matches this.firstName
                link: { required }, // Matches this.lastName
                 
              }
            },
    template: `
    
    <div class="container">
    <div class="rox">
    <div class="col-md-6">
        <div class="form-group" :class="{ error: v$.title.$errors.length }">
          <label>Social media links</label>
          <v-btn append-icon="home" @click="addItem"> Add </v-btn>
          <ul class="internalFaq">
            <li v-for="(item, index)  in Storage.Data.Module1"  :key="item.id">
              <input  type="text" class="form-control"  aria-describedby="title"  v-model="item.title"/>
              <input  type="text" class="form-control"  aria-describedby="link"  v-model="item.link"/>
              <v-btn append-icon="$minus" @click="removeItem(index)"> Remove </v-btn>
              </li>
  
            </ul>
          </div>
        </div>
           </div>
   </div>
    `
  });