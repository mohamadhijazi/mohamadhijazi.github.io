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
   
    <div>
    <ul>
    <li v-for="item in Storage.Data.Module1">
     <h1>Hi, let's connect on {{ item.title }}!</h1>
    <p>Kindly scan my QR Code below:</p>
    <div class="qrcode">
    <qrcode-svg :value="item.link" level="H"></qrcode-svg>
        <div class="hand"></div>
    </div>
   
</li>
    </ul>
     <script>
        // Function to change theme
        function changeTheme(theme) {
            document.body.className = theme;
            if (theme === 'winter') {
                createSnowflakes();
            } else if (theme === 'summer') {
                createFlowers();
            } else {
                clearElements();
            }
        }

        // Function to create snowflakes
        function createSnowflakes() {
            clearElements();
            for (let i = 0; i < 50; i++) {
                let snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.style.left = Math.random() * 100 + 'vw';
                snowflake.style.animationDuration = Math.random() * 3 + 7 + 's';
                document.body.appendChild(snowflake);
            }
        }

        // Function to create flowers
        function createFlowers() {
            clearElements();
            for (let i = 0; i < 50; i++) {
                let flower = document.createElement('div');
                flower.className = 'flower';
                flower.style.left = Math.random() * 100 + 'vw';
                flower.style.animationDuration = Math.random() * 3 + 7 + 's';
                document.body.appendChild(flower);
            }
        }

        // Function to clear existing elements
        function clearElements() {
            document.querySelectorAll('.snowflake, .flower').forEach(el => el.remove());
        }
    </script>
    <div>
        <button onclick="changeTheme('winter')">Winter Theme</button>
        <button onclick="changeTheme('summer')">Summer Theme</button>
        <button onclick="changeTheme('insta')">Instagram Theme</button>
    </div>
   </div>
    `
  });