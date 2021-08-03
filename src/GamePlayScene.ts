namespace CutTheRopGame {
  export enum BODY_LABEL {
      BALL = 1,
      DOG = 2,
      STARS = 3
  } 
  export class GamePlayScene extends Phaser.Scene {
    private initialView?: Phaser.GameObjects.Group;
    private logo?: Phaser.GameObjects.Image;
    private playButton?: Phaser.GameObjects.Image;
    private rope?: any;
    private ball?: any;
    private hook?: any;
    private hook1?: any;
    private drawing: boolean = false;
    private lineGrapic?: any;
    private graphics: any;
    private ropeGrapics: any;
    private ropeGrapics1: any;
    private knife?: any;
    private ropeConstraint?: any;
    private ropeConstraint1?: any;
    private isBallFallen?: boolean = false;
    private rope1?: any;
    private isRope1Cut: boolean = false;
    private isRope2Cut: boolean = false;
    private starLen = 3;
    private starsArr?: any = [];
    private starsCount: number = 0
    private dog?:any;
    private starText: any;

    constructor() {
      super("hello world");
    }

    preload() {
      this.load.image("background", "assets/background.png");
      this.load.image("logo", "assets/logo.png");
      this.load.image("play", "assets/play.png");
      this.load.image("rope", "assets/rope.png");
      this.load.image("hook", "assets/jointer.png");
      this.load.image("ball", "assets/ball.png");
      this.load.image("knife", "assets/knife.png");
      this.load.image("star", "assets/star.png");
      this.load.image("dog", "assets/dog.png");

    }

    create() {
      this.matter.world.setBounds(
        10,
        10,
        (this.game as any).config.width - 20,
        (this.game as any).config.height - 20
      );
      this.add.image(0, 0, "background").setOrigin(0, 0);

      this.showInitialScreen();
    }

    showInitialScreen() {
      this.initialView = this.add.group();
      this.logo = this.add.image(500, 250, "logo").setOrigin(0.5, 0.5);
      this.playButton = this.add.image(500, 500, "play").setOrigin(0.5, 0.5);
      this.playButton.setInteractive({ useHandCursor: true });
      this.playButton.on("pointerdown", this.playButtonClicked.bind(this));
      this.initialView.add(this.logo);
      this.initialView.add(this.playButton);
    }

    playButtonClicked() {
      this.initialView?.setVisible(false);
      this.isBallFallen = false;
      this.graphics = this.add.graphics();
      this.ropeGrapics = this.add.graphics();
      this.ropeGrapics1 = this.add.graphics();
      this.playButton?.off("pointerdown", this.playButtonClicked.bind(this));
      this.addHook();
      this.addScoreCard()
      this.addStars();
      this.addDog();
      this.addBall();
      this.addRope();
      this.drawLine();
      this.checkCollision();
     
      
    }

    addScoreCard(){
        const star: any = this.add.image(40, 40, 'star');
        this.starText = this.add.text(60,26,"0",{ font: "25px Arial", align: "center" });
       
    }
    addStars(){
        const diff = 50;
        for(let i = 1; i<= this.starLen; i++){
            const star: any = this.matter.add.image(515, (220 + i*diff), 'star');
            star.setStatic(true);
            star.body.label = BODY_LABEL.STARS+ (i-1);
            this.starsArr.push(star);
        }
    }
    addDog(){
        this.dog = this.matter.add.image(515, 530, 'dog');
        this.dog.setStatic(true);
        this.dog.body.label = BODY_LABEL.DOG;
    }

    checkCollision() {
      this.matter.world.on("collisionstart", this.ropeCollision.bind(this));
    }

    drawLine() {
      this.knife = this.matter.add
        .image(this.input.mousePointer.x, this.input.mousePointer.y, "knife")
        .setOrigin(0.0, 0.0);
      this.knife.setScale(0.05, 0.05);
      this.knife.setStatic(true);
      this.knife.setVisible(false);
      this.input.on("pointerdown", this.startDrawing.bind(this));
      this.input.on("pointerup", this.stopDrawing.bind(this));
    }

    startDrawing() {
      if (!this.lineGrapic && !this.isBallFallen) {
        this.drawing = true;
        this.lineGrapic = new Phaser.Geom.Line(
          this.input.mousePointer.x,
          this.input.mousePointer.y,
          this.input.mousePointer.x,
          this.input.mousePointer.y
        );
        this.graphics.lineStyle(2, 0x00ff00);
        this.graphics.strokeLineShape(this.lineGrapic);
      }
    }
    stopDrawing() {
      if (this.lineGrapic && !this.isBallFallen) {
        this.drawing = false;
        this.graphics.clear();
        this.knife.setVisible(false);
        this.lineGrapic = null;
      }
    }
    update() {
      if (!this.isBallFallen && this.drawing && this.lineGrapic) {
        this.lineGrapic.x2 = this.input.mousePointer.x;
        this.lineGrapic.y2 = this.input.mousePointer.y;
        this.graphics.clear();
        this.graphics.fillStyle(0xffffff);
        this.graphics.lineStyle(2, 0x00ff00);
        this.graphics.strokeLineShape(this.lineGrapic);

        this.knife.x = this.input.mousePointer.x;
        this.knife.y = this.input.mousePointer.y;
        this.knife.setVisible(true);
      }
      if (!this.isRope1Cut && this.rope) {
        this.rope.x2 = this.ball.x;
        this.rope.y2 = this.ball.y;
        this.ropeGrapics.clear();
        this.ropeGrapics.fillStyle(0xffffff);
        this.ropeGrapics.lineStyle(2, 0xa9a9a9);
        this.ropeGrapics.strokeLineShape(this.rope);
      }
      if (!this.isRope2Cut && this.rope1) {
        this.rope1.x2 = this.ball.x;
        this.rope1.y2 = this.ball.y;
        this.ropeGrapics1.clear();
        this.ropeGrapics1.fillStyle(0xffffff);
        this.ropeGrapics1.lineStyle(2, 0xa9a9a9);
        this.ropeGrapics1.strokeLineShape(this.rope1);
      }

      if (!this.isBallFallen && this.rope && this.lineGrapic) {
        let p: any = { x: 0, y: 0 };
        if (Phaser.Geom.Intersects.LineToLine(this.rope, this.lineGrapic, p)) {
          this.matter.world.removeConstraint(this.ropeConstraint);
          this.ropeGrapics.clear();
          this.isRope1Cut = true;
        }
        if (Phaser.Geom.Intersects.LineToLine(this.rope1, this.lineGrapic, p)) {
          this.matter.world.removeConstraint(this.ropeConstraint1);
          this.ropeGrapics1.clear();
          this.isRope2Cut = true;
        }
      }
      if( this.isRope1Cut && this.isRope2Cut){
        this.graphics.clear();
        this.input.off("pointerdown", this.startDrawing.bind(this));
        this.input.off("pointerup", this.stopDrawing.bind(this));
        this.isBallFallen = true;
        this.knife.setVisible(false);
      }
      if(this.starText && this.starsCount>0){
          this.starText.text = ": " +  this.starsCount+ "";
      }
    }

    ropeCollision(b1: any, body1: any, body2: any) {
        if(body1 && body2){
            switch(body1.label){
                case BODY_LABEL.STARS:
                    this.starsCount++;
                    this.starCollision(body1.label);
                    break
                case BODY_LABEL.STARS+1:
                    this.starsCount++;
                    this.starCollision(body1.label);
                    break
                case BODY_LABEL.STARS+2:
                    this.starsCount++;
                    this.starCollision(body1.label);
                    break
                case BODY_LABEL.DOG:
                    this.dogCollision();
                    break

            }
           
        }
    
    }

    dogCollision() {
        this.scene.scene.children.remove(this.ball);
        this.ball.destroy()
    }
    starCollision(label: number) {
        for(let i = 0; i< this.starsArr.length; i++){
            const star: any = this.starsArr[i];
            if(star.body && star.body.label === label){
                this.scene.scene.children.remove(star);
                star.destroy()
            }
        
        }
    }

   addHook() {
      this.hook = this.matter.add.image(513, 60, "hook");
      this.hook.setStatic(true);

      this.hook1 = this.matter.add.image(650, 60, "hook");
      this.hook1.setStatic(true);
    }
    addBall() {
      this.ball = this.matter.add.image(
        (this.game as any).config.width / 2,
        (this.game as any).config.height / 2,
        "ball",
        undefined,
        { mass: 0.1 }
      );
      this.ball.setScale(2, 2);
      this.ball.body.label = BODY_LABEL.BALL;
    }

    addRope() {
      this.rope = null;
      this.ropeConstraint = null;
      this.ropeConstraint = this.matter.add.joint(this.ball, this.hook, 150, 0);
      this.rope = new Phaser.Geom.Line(
        this.hook.x,
        this.hook.y,
        this.ball.x,
        this.ball.y
      );
      this.ropeGrapics.lineStyle(2, 0xa9a9a9);
      this.ropeGrapics.strokeLineShape(this.rope);

      this.rope1 = null;
      this.ropeConstraint1 = null;
      this.ropeConstraint1 = this.matter.add.joint(
        this.ball,
        this.hook1,
        150,
        0
      );
      this.rope1 = new Phaser.Geom.Line(
        this.hook1.x,
        this.hook1.y,
        this.ball.x,
        this.ball.y
      );
      this.ropeGrapics1.lineStyle(2, 0xa9a9a9);
      this.ropeGrapics1.strokeLineShape(this.rope1);
    }
  }
}
