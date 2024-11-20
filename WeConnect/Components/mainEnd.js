var MyStorage={Data:{Module1:[],Module2:[]}};

MyStorage.init=function(){
  MyStorage["Data"]={};
  MyStorage.Data.Module1=[];
  MyStorage.Data.Module2=[];
  
  var module1=localStorage.getItem("Module1");
  var module2=localStorage.getItem("Module2");
  if(module1&&module1!=""){
    MyStorage.Data.Module1=JSON.parse(module1);

  }

  if(module2 &&module2!=""){

    MyStorage.Data.Module2=JSON.parse(module2);

  }
  let link=getParameterByName("link"); 
    let title=getParameterByName("title"); 

    if(link && title && link!="" &&title!=""){

      MyStorage.addItem("Module1",{"title":title,"link":link,"type":"linkedin"});
    }
};
MyStorage.bulkUpdate=function(m){
    localStorage.setItem(m, JSON.stringify(MyStorage.Data[m]));
};
MyStorage.addItem=function(m,item){
  if(item.id){
    for(var i=0; i< MyStorage["Data"][m].length;i++){
      var itemIn=MyStorage["Data"][m][i];
      if(itemIn.id==item.id){
        MyStorage["Data"][m][i]=item;
        break;
      }
  
    }
  }else{
    item.id=MyStorage["Data"][m].length;
    MyStorage.Data[m].push(item);
  }
  // Set Item
localStorage.setItem(m, JSON.stringify(MyStorage.Data[m]));
};

MyStorage.deleteItem=function(m,item){
  for(var i=0; i< MyStorage["Data"][m].length;i++){
    var itemIn=MyStorage["Data"][m][i];
    if(itemIn.id==item.id){
      MyStorage["Data"][m].splice(i, 1); 
      break;
    }

  }
  // Set Item
  localStorage.setItem(m, JSON.stringify(MyStorage.Data[m]));
};

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  MyStorage.init();

vueapp.use(vuetify).mount('#app');

// window.onload = () => {
//     'use strict';
  
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker
//                .register('../innovation_files/sw.js');
//     }
//   }