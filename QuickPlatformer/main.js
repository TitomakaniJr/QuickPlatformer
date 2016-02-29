(function () {

	"use strict";

	// imports
	var CommandEnum = com.dgsprb.quick.CommandEnum;
	var Quick = com.dgsprb.quick.Quick;
	var GameObject = com.dgsprb.quick.GameObject;
	var Scene = com.dgsprb.quick.Scene;
	var Animation = com.dgsprb.quick.Animation;
	var Frame = com.dgsprb.quick.Frame;
	var Rect = com.dgsprb.quick.Rect;
	var ImageFactory = com.dgsprb.quick.ImageFactory;

	function main() {
		Quick.setName("QuickPlatformer");
		Quick.init(function () { return new GameScene() });
	}

	var Background = (function () {

		function Background() {
			GameObject.call(this);
			this.setImageId("backgroundSprite")
			this.setWidth(Quick.getWidth());
			this.setHeight(Quick.getHeight());
		}; Background.prototype = Object.create(GameObject.prototype);

		return Background;

	})();


	var GameScene = (function () {

		function GameScene() {
			Scene.call(this);
			this.add(new Background());
			var ground = new Ground();
			ground.setCenterX(Quick.getWidth() / 2);
			this.add(ground);
			var player = new Player();
			player.setCenterX(20);
			player.setBottom(ground.getTop() - 1);
			this.add(player);
			this.platform = new Platform();
			this.add(this.platform);
			this.platform = new Platform();
			this.add(this.platform);
			this.flag = new Flag();
			this.add(this.flag);
		}; GameScene.prototype = Object.create(Scene.prototype);

		// override
		GameScene.prototype.getNext = function () {
			return new GameScene();
		};

		return GameScene;

	})();

	var PlatformSection = (function () {

		function PlatformSection(imgNum, xPos, yPos) {
			GameObject.call(this);
			this.setImageId("platSprite" + imgNum);
			this.setSolid();
			this.setWidth(32);
			this.setHeight(23);
			this.setCenterX(100 + (32 * imgNum) + xPos);
			this.setBottom(Quick.getHeight() - 50 - yPos);
			
		}; PlatformSection.prototype = Object.create(GameObject.prototype);

		return PlatformSection;

	})();
	
	var Platform = (function () {

		function Platform() {
			GameObject.call(this);
		}; Platform.prototype = Object.create(GameObject.prototype);

		// override
		Platform.prototype.init = function () {
			var xPos = Quick.random(300);
			var yPos = Quick.random(50);
			this.left = new PlatformSection(1, xPos, yPos);
			this.getScene().add(this.left);
			this.middle = new PlatformSection(2, xPos, yPos);
			this.getScene().add(this.middle);
			this.right = new PlatformSection(3, xPos, yPos);
			this.getScene().add(this.right);
		};

		return Platform;

	})();
	
	var Flag = (function () {

		function Flag() {
			GameObject.call(this);
			this.addTag("flag")
			this.setImageId("flagSprite");
			this.setSolid();
			this.setWidth(32);
			this.setHeight(32);
			this.setCenterX(Quick.getWidth() - 32);
			this.setBottom(Quick.getHeight() -32);
		}; Flag.prototype = Object.create(GameObject.prototype);

		return Flag;

	})();
	
	// class Ground extends GameObject
	var Ground = (function () {

		function Ground() {
			GameObject.call(this);
			this.setImageId("groundSprite");
			this.setSolid();
			this.setWidth(Quick.getWidth() * 2);
			this.setHeight(32);
			this.setBottom(Quick.getHeight() - 1);
		}; Ground.prototype = Object.create(GameObject.prototype);

		return Ground;

	})();

	// class Player extends GameObject
	var Player = (function () {
		
		var WALK_ANIMATION = new Animation([
			new Frame(document.getElementById("playerSpriteWalk1"), 3),
			new Frame(document.getElementById("playerSpriteWalk2"), 3),
			new Frame(document.getElementById("playerSpriteWalk3"), 3),
			new Frame(document.getElementById("playerSpriteWalk4"), 3),
			new Frame(document.getElementById("playerSpriteWalk5"), 3),
			new Frame(document.getElementById("playerSpriteWalk6"), 3),
			new Frame(document.getElementById("playerSpriteWalk7"), 3),
			new Frame(document.getElementById("playerSpriteWalk8"), 3),
			new Frame(document.getElementById("playerSpriteWalk9"), 3),
			new Frame(document.getElementById("playerSpriteWalk10"), 3),
			new Frame(document.getElementById("playerSpriteWalk11"), 3)
		]);
		
		var SPEED = 2;

		function Player() {
			GameObject.call(this);
			this.canJump = true;
			this.controller = Quick.getController();
			this.addTag("player");
			this.setAccelerationY(0.5);
			this.setImageId("playerSpriteStand");
			this.setEssential();
			this.setSolid();
			this.setCenterY(Quick.getHeight() - 1);
		}; Player.prototype = Object.create(GameObject.prototype);

		// override
		Player.prototype.onCollision = function (gameObject) {
			var collision = this.getCollision(gameObject);
			if(gameObject.hasTag("flag")){
				this.expire();
			}
			if (collision.getBottom() && this.getSpeedY() > 0) {
				this.setSpeedY(0);
				this.setBottom(gameObject.getTop() - 1);
				this.canJump = true;
			} else if (collision.getTop()) {
				this.stop();
				this.setTop(gameObject.getBottom() + 1);
			} else if (collision.getLeft()) {
				this.setLeft(gameObject.getRight() + 1);
			} else if (collision.getRight()) {
				this.setRight(gameObject.getLeft() - 1);
			}
		};

		// override
		Player.prototype.update = function () {
			if (this.getTop() < 0) {
				this.expire();
			}
			if (this.controller.keyDown(CommandEnum.LEFT) && this.getLeft() > 0) {
				if(this.canJump == true){
					this.setAnimation(WALK_ANIMATION);
				}
				this.moveX(-SPEED);
			} else if (this.controller.keyDown(CommandEnum.RIGHT) && this.getRight() < Quick.getWidth()) {
				if(this.canJump == true){
					this.setAnimation(WALK_ANIMATION);
				}
				this.moveX(SPEED);
			}
			else if(this.canJump == true) {
				this.setImageId("playerSpriteStand");
			}
			if (this.canJump && this.controller.keyPush(CommandEnum.A)) {
				this.setImageId("playerSpriteJump");
				this.canJump = false;
				this.setSpeedY(-8);
			}
		};

		return Player;

	})();

	main();

})();
