// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class main extends cc.Component {

    canvas: cc.Node = new cc.Node();
    backLine: cc.Graphics = null;
    textNodeList: cc.Node[] = [];

    // 文字節點參數
    SpeedLevel: number = 1; // 文字節點速度等級
    textNodeSpeed: number = 100; // 文字節點每等級移動的像素數
    fontSize: number = 100; // 文字節點字體大小
    removeTextLine: number = 0; // 應該消失的位置

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // 設定視窗大小自適應
        cc.view.setDesignResolutionSize(cc.winSize.width, cc.winSize.height, cc.ResolutionPolicy.SHOW_ALL);

        this.canvas = this.node.parent || cc.find('Canvas');
        if (!this.canvas) {
            cc.warn('未找到 Canvas，無法顯示');
            return;
        }

        const backLineNode = this.canvas.getChildByName('backLine') || new cc.Node('backLine');
        if (!backLineNode.parent) {
            this.canvas.addChild(backLineNode);
        }

        this.backLine = backLineNode.getComponent(cc.Graphics) || backLineNode.addComponent(cc.Graphics);
        this.backLine.node.setAnchorPoint(0.5, 0.5);
        this.backLine.node.setContentSize(cc.winSize.width, this.fontSize);
        this.backLine.node.setPosition(0, -cc.winSize.height / 3);
        this.backLine.node.zIndex = 10;
        this.backLine.node.opacity = 255;
        this.backLine.node.active = true;
        this.backLine.node.color = cc.Color.WHITE;

        this.backLine.clear();
        this.backLine.fillColor = cc.color(255, 255, 255, 255);
        this.backLine.rect(-cc.winSize.width / 2, -this.fontSize / 2, cc.winSize.width, this.fontSize);
        this.backLine.fill();

        this.removeTextLine = this.backLine.node.y + this.backLine.node.height / 2;

        const newTextNode = this.createNewTextNode('あ');
        this.textNodeList.push(newTextNode);
        this.canvas.addChild(newTextNode);
    }

    update (dt) {
        if (this.textNodeList.length > 0) {
            const textNode = this.textNodeList[0];
            textNode.y -= this.textNodeSpeed * this.SpeedLevel * dt; // 每秒向下移動
            if (textNode.y < this.removeTextLine) {
                this.canvas.removeChild(textNode);
                this.textNodeList.shift();
            }
        }
    }

    createNewTextNode(text: string): cc.Node {
        const textNode = new cc.Node('helloLabel');
        const label = textNode.addComponent(cc.Label);
        label.string = text;
        label.fontSize = this.fontSize;
        label.lineHeight = this.fontSize;
        textNode.setAnchorPoint(0.5, 0.5);
        const visibleTop = cc.winSize.height / 2 + this.fontSize;
        textNode.setPosition(0, visibleTop);
        textNode.color = cc.Color.WHITE;
        textNode.opacity = 255;
        textNode.setContentSize(240, 60);
        return textNode;
    }
}
