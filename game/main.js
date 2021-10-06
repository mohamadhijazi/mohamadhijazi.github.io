var canvas = CE.defines("canvas_id").
        extend(Scrolling).
        extend(Animation).
        extend(Hit).
         extend(Input).
        ready(function() {
            canvas.Scene.call("MyScene");
        });
            
canvas.Scene.new({
    name: "MyScene",
    materials: {
        images: {
            "bird": "Bird.png",
            "sky": "sky.jpg",
            "box":"crate.jpg"
        }
    },
   /* ready: function(stage) {
        var map, animation;
        
        var self = this;
        
        function _entity(x, y, img) {
            var entity = Class.New("Entity", [stage]);
            entity.rect(128);
            entity.position(x, y);
            entity.el.drawImage(img);
            stage.append(entity.el);
            return entity;
        }
        this.scrolling = canvas.Scrolling.new(this, 64, 64);

        this.player = this.createElement();
        this.player.y = 110;
        this.box1=this.createElement();
        this.box1.drawImage("box");
        this.box1.x=150;
        animation = canvas.Animation.new({
            images: "bird",
            animations: {
                walk: {
                    frames: [1, 3],
                    size: {
                        width: 320/5,
                        height: 64
                    },
                    frequence: 5
                }
            }
        });
        
        
        animation.add(this.player);
        animation.play("walk", "loop");
        
        
        this.scrolling.setMainElement(this.player);
        
        map = this.createElement();
        map.drawImage("sky");
        map.append(this.player);
       map.append(this.box1);
        this.scrolling.addScroll({
           element: map, 
           speed: 2,
           block: true,
           width: 1200,
           height: 300
        });
        
        stage.append(map);
        
    },
    render: function(stage) {
        this.player.x += 2;
        this.scrolling.update();
        //stage.refresh();
        
    this.box1.move(-2); // Position X + 2
        
        this.player.hit([this.box1], function(state, el) {
            if (state == "over") {
                el.opacity = 0.5;
            }
            else {
                el.opacity = 1;
            }
        });
        stage.refresh();
        
    }*/
    ready: function(stage) {
        var self = this;
        
        function _entity(x, y,img) {
            var entity = Class.New("Entity", [stage]);
            entity.rect(128);
            entity.position(x, y);
            entity.el.drawImage(img);
            stage.append(entity.el);
            return entity;
        }
         this.player = _entity(0, 50,"bird");
         var p=this.player;
        this.btn=this.createElement();
        this.btn.fillText("Restart");
        this.btn.fillStyle="red";
        this.btn.font="normal 20px Arial";
        this.btn.x=5;
       // this.btn.on("click",function(e){this.player.el.x=0;});
         animation = canvas.Animation.new({
            images: "bird",
            animations: {
                walk: {
                    frames: [1, 3],
                    size: {
                        width: 320/5,
                        height: 64
                    },
                    frequence: 5
                }
            }
        });
        
        
        animation.add(this.player.el);
        animation.play("walk", "loop");
       // this.box1 = _entity(0, 50,"bird");
        this.box2 = _entity(200, 50,"box");
        var A=0;
        this.box2.el.on("click",function(e){A=1;});
        stage.append(this.btn);
        
         canvas.Input.keyDown(Input.A, function(e) {
      A=1;alert(A);
        });
        if(A==1){
        this.player.el.x=0;
        alert("A");
        }
    },
    render: function(stage) {

       this.player.move(2); // Position X + 2
        var hits=0;
        this.box2.hit([this.player], function(state, el) {
            if (state == "over") {
                el.opacity = 0.5;
                hits=1;
            }
            else {
                el.opacity = 1;
               // hits=0;
            }
        });
         this.box2.el.on("click",function(e){hits=1;});
        if(hits==1)
        {//this.player.move(-this.player.el.x);
     //  alert("hit");
        }
        stage.refresh();
    }
});