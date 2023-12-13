if(typeof(Storage) !== 'undefined') {
//alert("hi");
   // Store
//localStorage.clear();
//$('#tiles').html(" ");
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
//

function synEntry(i,data){

if(localStorage.getItem(i)  && data == localStorage.getItem(i).toString())
localStorage.setItem(i,data);
else{//alert("diff");
var newdata=data.split("/#/");
localStorage.setItem(i,newdata[0]+"/#/1");
}
}
//synEntry('1', 'images/img1.jpg/@/Loremhassan2 Ipsum55 is simply/@/Movies/@/hassan hmad simply dummy text of the printing & typesetting //industry./#/0');
synEntry('1', 'http://rjbtech.com/PublishingImages/0001%20SP%202013%20Logo.png/@/<a href="https://mohamadhijazi.github.io/ImageMap/"> JS</a>/@/JS/@/With the help of our generator creating html imagemaps is free and easy. Simply start by selecting an image from your pc, or load one directly from an external website. Next up create your hot areas using either rectangle, circle or polygon shapes. Creating these shapes is as easy as pointing and clicking on your image. Do n0t forget to enter a link, title and target for each of them. Then once you are finished simply click Show Me The Code!./#/0');


synEntry('2', 'http://cnet4.cbsistatic.com/hub/i/r/2014/08/04/5c61cce9-7e6c-4519-a6da-d64c787eea8a/resize/370xauto/7d32b03f89f0c46855b469343259ebe0/pvativbook92014.jpg/@/<a href="/PBIVz.html"> PBI</a>/@/PBI/@/Imagemap Power BI Custom Visual that can be used on any image and support select,external links, and drill through/#/0');

synEntry('3', 'https://raw.githubusercontent.com/mohamadhijazi/mohamadhijazi.github.io/master/images/sharepoint-infopath.jpg/@/<a href="https://mohamadhijazi.github.io/InfoPath/">File upload SharePoint InfoPath</a>/@/InfoPath/@/InfoPath web page with section that allow to upload files with drag and drop or upload selector to SharePoint Document library, and after upload will update the properties to map documents to submitted form./#/0');

synEntry('4', 'http://cnet4.cbsistatic.com/hub/i/r/2014/08/04/5c61cce9-7e6c-4519-a6da-d64c787eea8a/resize/370xauto/7d32b03f89f0c46855b469343259ebe0/pvativbook92014.jpg/@/<a href="/NewsPage.html"> Press Release</a>/@/PR/@/Amazon Press release/#/0');

// Retrieve
var temp="<li onclick='location.href=\"single-page.html\";'> <img src='images/img3.jpg' width='282' height='210'><div class='post-info'><div class='post-basic-info'> <h3><a href='#'>Lorem Ipsum is simply</a></h3> <span><a href='#'><label> </label>Movies</a></span>	<p>Lorem Ipsum is simply dummy text of the printing & typesetting industry.</p>	</div>	<div class='post-info-rate-share'>   			<div class='rateit'>    <span> </span>	</div>	 	<div class='post-share'>        				<span> </span> 	</div>		<div class='clear'> </div>		   		</div>			        	</div>			        </li>";

//document.getElementById('tiles').innerHTML = localStorage.getItem('lastname');
//$('#tiles').append(localStorage.getItem('lastname'));
for( var i=1;i<=localStorage.length;i++){
//alert("hi");
var Append=localStorage.getItem(i).split("/#/")

var data= localStorage.getItem(i).split("/@/");

//single("+i+")
	/*
var temp2="<li style=\" display: list-item;position: absolute;top: 0px;left: 141px;\" onclick='location.href=\"single-page.html?id="+i+"&type=false\"'> <img src='"+ data[0]+"' width='282' height='210'><div class='post-info'><div class='post-basic-info'> <h3><a href='#'>"+data[1]+"</a></h3> <span><a href='#'><label> </label>"+data[2]+"</a></span>	<p>"+data[3]+"</p>	</div>	<div class='post-info-rate-share'>   			 	    <div class='fb-like post-share' style=\"float:none\" data-href='http://gdriv.es/aranews/single-page.html?id="+i+"&type=false\' data-layout='standard' data-action='like' data-show-faces='true' data-share='true'></div>   				 		<div class='clear'> </div>		   		</div>			        	</div>			        </li>";
*/
var temp2="<li style=\" display: list-item;position: absolute;top: 0px;left: 141px;\" > <img src='"+ data[0]+"' width='282' height='210'><div class='post-info'><div class='post-basic-info'> <h3><a href='#'>"+data[1]+"</a></h3> <span><a href='#'><label> </label>"+data[2]+"</a></span>	<p>"+data[3]+"</p>	</div>	<div class='post-info-rate-share'>   			 	    <div class='fb-like post-share' style=\"float:none\" data-href='http://gdriv.es/aranews/single-page.html?id="+i+"&type=false\' data-layout='standard' data-action='like' data-show-faces='true' data-share='true'></div>   				 		<div class='clear'> </div>		   		</div>			        	</div>			        </li>";
 //alert($("#tiles li").length);
if( ( Append[1]==1 ||$("#tiles li").length < i) && $("#tiles li").length < i){
$('#tiles').prepend(temp2);
localStorage.setItem(i,Append[0]+"/#/0");

}else{
if( Append[1]==1 && $("#tiles li").length >=i ){
//alert($("#tiles li").length);
$('#tiles li').eq($("#tiles li").length - i).replaceWith(temp2);
localStorage.setItem(i,Append[0]+"/#/0");

}
}


/*function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split('&');
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split('=');
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}*/



/*
function single(id){
var datasinglepage= localStorage.getItem(id).split('/@/');

									 
								    
var temp2singlepage="<div class='artical-content'><img src='"+datasinglepage[0]+"' title='banner1'>									<h3><a href='#'>"+datasinglepage[1]+"</a></h3>									<p>"+datasinglepage[3]+"</p><div class='fb-comments' data-href='currentsite/single-page.html?id="+id+"&type=false' data-numposts='5' data-colorscheme='light'></div></div>";
$('.single-page-artical').html(temp2singlepage);
location.href="/#artical-content";
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&appId=428311193974436&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
}*/
var $tiles = $('#tiles'),options = {
		            autoResize: true, // This will auto-update the layout when the browser window is resized.
		            
		            offset: 20, // Optional, the distance between grid items
		            itemWidth:280 // Optional, the width of a grid item
		          };
$handler = $('li', $tiles);
		          $handler.wookmark(options);}
} else {
    // Sorry! No Web Storage support..
}

