// Register the `hello` component
vueapp.component('HeaderComponenet', {
    data: function(){
      return{
      tab:"index.html",
      }
    },
    template: `
    <v-app-bar
      :order="order"
      color="grey-lighten-2"
      title="We Connect"
      flat
    >
      <template v-slot:append>
         
        <v-tabs
        v-model="tab"
        bg-color="primary"
      >
        <v-tab value="index.html"><a href="index.html">Home</a></v-tab>
         <v-tab value="Edit.html"><a href="Edit.html">Edit</a></v-tab>
        <v-tab value="Planner.html"><a href="Planner.html">Tasks</a></v-tab>
      </v-tabs>

      </template>
    </v-app-bar>

    `,
    mounted:function(){
      let split=window.location.pathname.split("/"); 
      let pagename=split[split.length-1];
      this.tab=pagename;
    }
  });