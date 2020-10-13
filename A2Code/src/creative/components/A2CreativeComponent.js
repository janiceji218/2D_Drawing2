import {
    AObject,
    AView2D,
    AGraphicsComponent2D,
    AController2D,
    AComponentController2D
} from "AniGraph"

import A2CreativeModel from "../model/A2CreativeModel";
import A2CreativeModelController from "../controllers/A2CreativeModelController";
import A2CreativeView from "../views/A2CreativeView";
import A2TimeView from "../views/A2TimeView";

export default class A2CreativeComponent extends AGraphicsComponent2D {
    static ComponentControllerClass = AComponentController2D;
    static ModelClassMap = {
        'default': {
            controllerClass: A2CreativeModelController,
            viewClass: A2CreativeView,
            modelClass: A2CreativeModel
        }
    }
    constructor(props) {
        super(props);
    }

    addViewClass(vclass){
        this.viewClassesDict[vclass.name]=vclass;
        AObject.RegisterClass(vclass);
    }

    initViewClasses(){
        this.viewClassesDict = {
        };
        this.addViewClass(AView2D);
        this.addViewClass(A2CreativeView);
        this.addViewClass(A2TimeView);
    }

    release(){
        this.stopTimer();
        super.release();
    }

    startTimer(period){
        if(this.timerID!==null){
            this.stopTimer();
        }
        if(this.timerID === null) {
            this.timerID = setInterval(
                () => this.tick(),
                period
            );
        }
    }
    stopTimer(){
        if(this.timerID !== null) {
            clearInterval(this.timerID);
            this.timerID = null;
        }
    }

    tick(){
        var t = Date.now();
        this.setAppState('appTime', t);
        this.signalAppEvent('update');
    }


    initAppState(){
        super.initAppState();
        const self = this;
        this.initViewClasses();
        this.setAppState('availableViewClasses',
            this.viewClassesDict
        );
        for(let vc in this.viewClassesDict){
            AObject.RegisterClass(this.viewClassesDict[vc]);
        }
        this.addAppStateListener('selectedModelControllers', function(selectedModelControllers){
            const selectedModel = selectedModelControllers && selectedModelControllers.length? selectedModelControllers[0].getModel() : undefined;
            self.setState({selectedModel: selectedModel});
        });
        this.setAppState('saveCreativeSVG', this.saveSVG);
        this.addAppEventListener('update', this.onAppUpdate);

        this.addAppStateListener('timerPeriod', (period)=>{
            self.stopTimer();
            self.startTimer(period);
        });
        this.addAppStateListener('AutoPlay', (autoplay)=>{
            if(autoplay){
                this.startTimer();
            }else{
                this.stopTimer();
            }
        });
    }

    // setViewMode(viewMode){
    //     this.componentController.replaceViewClass(this.viewClassesDict[viewMode]);
    // }
    bindMethods() {
        super.bindMethods();
        this.saveSVG = this.saveSVG.bind(this);
        this.onAppUpdate = this.onAppUpdate.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.tick = this.tick.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
    }

    onAppUpdate(){
        this.getModel().notifyDescendants();
    }

    saveSVG(){this.getGraphicsContext().saveSVG();}

}