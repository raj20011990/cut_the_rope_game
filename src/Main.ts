/// <reference path="GamePlayScene.ts" />
namespace CutTheRopGame {
  export class Main {
    private gamePlayScene: Phaser.Scene = new GamePlayScene();
    private config: Phaser.Types.Core.GameConfig = {
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

    constructor(){
         new Phaser.Game(this.config)
    }
  }
  export let mainGame = new Main();
}
