"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CutTheRopGame;
(function (CutTheRopGame) {
    var BODY_LABEL;
    (function (BODY_LABEL) {
        BODY_LABEL[BODY_LABEL["BALL"] = 1] = "BALL";
        BODY_LABEL[BODY_LABEL["DOG"] = 2] = "DOG";
        BODY_LABEL[BODY_LABEL["STARS"] = 3] = "STARS";
    })(BODY_LABEL = CutTheRopGame.BODY_LABEL || (CutTheRopGame.BODY_LABEL = {}));
    var GamePlayScene = /** @class */ (function (_super) {
        __extends(GamePlayScene, _super);
        function GamePlayScene() {
            var _this = _super.call(this, "hello world") || this;
            _this.drawing = false;
            _this.isBallFallen = false;
            _this.isRope1Cut = false;
            _this.isRope2Cut = false;
            _this.starLen = 3;
            _this.starsArr = [];
            _this.starsCount = 0;
            return _this;
        }
        GamePlayScene.prototype.preload = function () {
            this.load.image("background", "assets/background.png");
            this.load.image("logo", "assets/logo.png");
            this.load.image("play", "assets/play.png");
            this.load.image("rope", "assets/rope.png");
            this.load.image("hook", "assets/jointer.png");
            this.load.image("ball", "assets/ball.png");
            this.load.image("knife", "assets/knife.png");
            this.load.image("star", "assets/star.png");
            this.load.image("dog", "assets/dog.png");
        };
        GamePlayScene.prototype.create = function () {
            this.matter.world.setBounds(10, 10, this.game.config.width - 20, this.game.config.height - 20);
            this.add.image(0, 0, "background").setOrigin(0, 0);
            this.showInitialScreen();
        };
        GamePlayScene.prototype.showInitialScreen = function () {
            this.initialView = this.add.group();
            this.logo = this.add.image(500, 250, "logo").setOrigin(0.5, 0.5);
            this.playButton = this.add.image(500, 500, "play").setOrigin(0.5, 0.5);
            this.playButton.setInteractive({ useHandCursor: true });
            this.playButton.on("pointerdown", this.playButtonClicked.bind(this));
            this.initialView.add(this.logo);
            this.initialView.add(this.playButton);
        };
        GamePlayScene.prototype.playButtonClicked = function () {
            var _a, _b;
            (_a = this.initialView) === null || _a === void 0 ? void 0 : _a.setVisible(false);
            this.isBallFallen = false;
            this.graphics = this.add.graphics();
            this.ropeGrapics = this.add.graphics();
            this.ropeGrapics1 = this.add.graphics();
            (_b = this.playButton) === null || _b === void 0 ? void 0 : _b.off("pointerdown", this.playButtonClicked.bind(this));
            this.addHook();
            this.addScoreCard();
            this.addStars();
            this.addDog();
            this.addBall();
            this.addRope();
            this.drawLine();
            this.checkCollision();
        };
        GamePlayScene.prototype.addScoreCard = function () {
            var star = this.add.image(40, 40, 'star');
            this.starText = this.add.text(60, 26, "0", { font: "25px Arial", align: "center" });
        };
        GamePlayScene.prototype.addStars = function () {
            var diff = 50;
            for (var i = 1; i <= this.starLen; i++) {
                var star = this.matter.add.image(515, (220 + i * diff), 'star');
                star.setStatic(true);
                star.body.label = BODY_LABEL.STARS + (i - 1);
                this.starsArr.push(star);
            }
        };
        GamePlayScene.prototype.addDog = function () {
            this.dog = this.matter.add.image(515, 530, 'dog');
            this.dog.setStatic(true);
            this.dog.body.label = BODY_LABEL.DOG;
        };
        GamePlayScene.prototype.checkCollision = function () {
            this.matter.world.on("collisionstart", this.ropeCollision.bind(this));
        };
        GamePlayScene.prototype.drawLine = function () {
            this.knife = this.matter.add
                .image(this.input.mousePointer.x, this.input.mousePointer.y, "knife")
                .setOrigin(0.0, 0.0);
            this.knife.setScale(0.05, 0.05);
            this.knife.setStatic(true);
            this.knife.setVisible(false);
            this.input.on("pointerdown", this.startDrawing.bind(this));
            this.input.on("pointerup", this.stopDrawing.bind(this));
        };
        GamePlayScene.prototype.startDrawing = function () {
            if (!this.lineGrapic && !this.isBallFallen) {
                this.drawing = true;
                this.lineGrapic = new Phaser.Geom.Line(this.input.mousePointer.x, this.input.mousePointer.y, this.input.mousePointer.x, this.input.mousePointer.y);
                this.graphics.lineStyle(2, 0x00ff00);
                this.graphics.strokeLineShape(this.lineGrapic);
            }
        };
        GamePlayScene.prototype.stopDrawing = function () {
            if (this.lineGrapic && !this.isBallFallen) {
                this.drawing = false;
                this.graphics.clear();
                this.knife.setVisible(false);
                this.lineGrapic = null;
            }
        };
        GamePlayScene.prototype.update = function () {
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
                var p = { x: 0, y: 0 };
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
            if (this.isRope1Cut && this.isRope2Cut) {
                this.graphics.clear();
                this.input.off("pointerdown", this.startDrawing.bind(this));
                this.input.off("pointerup", this.stopDrawing.bind(this));
                this.isBallFallen = true;
                this.knife.setVisible(false);
            }
            if (this.starText && this.starsCount > 0) {
                this.starText.text = ": " + this.starsCount + "";
            }
        };
        GamePlayScene.prototype.ropeCollision = function (b1, body1, body2) {
            if (body1 && body2) {
                switch (body1.label) {
                    case BODY_LABEL.STARS:
                        this.starsCount++;
                        this.starCollision(body1.label);
                        break;
                    case BODY_LABEL.STARS + 1:
                        this.starsCount++;
                        this.starCollision(body1.label);
                        break;
                    case BODY_LABEL.STARS + 2:
                        this.starsCount++;
                        this.starCollision(body1.label);
                        break;
                    case BODY_LABEL.DOG:
                        this.dogCollision();
                        break;
                }
            }
        };
        GamePlayScene.prototype.dogCollision = function () {
            this.scene.scene.children.remove(this.ball);
            this.ball.destroy();
        };
        GamePlayScene.prototype.starCollision = function (label) {
            for (var i = 0; i < this.starsArr.length; i++) {
                var star = this.starsArr[i];
                if (star.body && star.body.label === label) {
                    this.scene.scene.children.remove(star);
                    star.destroy();
                }
            }
        };
        GamePlayScene.prototype.addHook = function () {
            this.hook = this.matter.add.image(513, 60, "hook");
            this.hook.setStatic(true);
            this.hook1 = this.matter.add.image(650, 60, "hook");
            this.hook1.setStatic(true);
        };
        GamePlayScene.prototype.addBall = function () {
            this.ball = this.matter.add.image(this.game.config.width / 2, this.game.config.height / 2, "ball", undefined, { mass: 0.1 });
            this.ball.setScale(2, 2);
            this.ball.body.label = BODY_LABEL.BALL;
        };
        GamePlayScene.prototype.addRope = function () {
            this.rope = null;
            this.ropeConstraint = null;
            this.ropeConstraint = this.matter.add.joint(this.ball, this.hook, 150, 0);
            this.rope = new Phaser.Geom.Line(this.hook.x, this.hook.y, this.ball.x, this.ball.y);
            this.ropeGrapics.lineStyle(2, 0xa9a9a9);
            this.ropeGrapics.strokeLineShape(this.rope);
            this.rope1 = null;
            this.ropeConstraint1 = null;
            this.ropeConstraint1 = this.matter.add.joint(this.ball, this.hook1, 150, 0);
            this.rope1 = new Phaser.Geom.Line(this.hook1.x, this.hook1.y, this.ball.x, this.ball.y);
            this.ropeGrapics1.lineStyle(2, 0xa9a9a9);
            this.ropeGrapics1.strokeLineShape(this.rope1);
        };
        return GamePlayScene;
    }(Phaser.Scene));
    CutTheRopGame.GamePlayScene = GamePlayScene;
})(CutTheRopGame || (CutTheRopGame = {}));
/// <reference path="GamePlayScene.ts" />
var CutTheRopGame;
/// <reference path="GamePlayScene.ts" />
(function (CutTheRopGame) {
    var Main = /** @class */ (function () {
        function Main() {
            this.gamePlayScene = new CutTheRopGame.GamePlayScene();
            this.config = {
                type: Phaser.AUTO,
                width: 1024,
                height: 576,
                physics: {
                    default: "matter",
                    matter: {
                        gravity: {
                            y: 1,
                        },
                        //debug:{}
                    },
                },
                scene: [this.gamePlayScene],
            };
            new Phaser.Game(this.config);
        }
        return Main;
    }());
    CutTheRopGame.Main = Main;
    CutTheRopGame.mainGame = new Main();
})(CutTheRopGame || (CutTheRopGame = {}));
//# sourceMappingURL=main.js.map