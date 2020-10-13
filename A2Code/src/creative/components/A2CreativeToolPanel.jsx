/*
 * Copyright (c) 2020. Abe Davis
 */
import React from "react"
import {Checkbox, SelectPicker, Toggle} from "rsuite";
import {Slider} from "rsuite";
import {
    AObject,
    AView2D,
    ASelectPicker,
    AControlSpecToolPanel
} from "AniGraph"


export default class A2CreativeToolPanel extends AControlSpecToolPanel{
    constructor(props){
        super(props);
    }

    /**
     * See how this is set in A1CreativeComponent
     */
    saveSVG(){
        this.getAppState('saveCreativeSVG')();
    }


    //##################//--App State--\\##################
    //<editor-fold desc="App State">
    onRunScriptButtonClick(){
        this.getAppState('onRunCreativeScriptButtonClick')();
    }

    /**
     *
     * @param className
     */
    setSelectedViewClass(name){
        const selectedModel = this.getSelectedModel();
        const viewClass = this.getViewClassForName(name);
        if(selectedModel && viewClass) {
            selectedModel.setViewClass(viewClass);
        }
        this.setAppState("selectedViewClass", name);
        this.signalAppEvent('update');
    }

    getViewClassForName(name){
        return this.state.availableViewClasses[name];
    }

    getNameForViewClass(viewClass){
        return viewClass? viewClass.name : undefined;
        // function getKeyByValue(object, value) {
        //     return Object.keys(object).find(key => object[key] === value);
        // }
        // var rval = getKeyByValue(this.state.availableViewClasses, viewClass);
        // return rval;
    }

    initAppState(){
        super.initAppState();
        const self = this;
        this.addAppStateListener('availableViewClasses', function(availableViewClasses){
            self.setState({availableViewClassesDataItems: self._getDropdownDataItems(availableViewClasses)});
            self.setState({availableViewClasses: availableViewClasses});
        });
        this.addAppStateListener('selectedModelControllers', function(selectedModelControllers){
            const selectedModel = (selectedModelControllers && selectedModelControllers.length>0)? selectedModelControllers[0].getModel() : undefined;
            if(selectedModel) {
                var vcname = selectedModel.getProperty('viewClass');
                if(!vcname){
                    vcname = 'AView2D';
                }
                var viewClass = AObject.GetClassNamed(vcname);//? vcname : "Default");
                // var namedict = {};
                // namedict[self.getNameForViewClass(viewClass)]=viewClass;
                // var stateDict = {selectedViewClass: namedict};
                // var stateDict = {selectedViewClass: self.getNameForViewClass(viewClass)};
                // self.setState(stateDict);
                const viewclassName = self.getNameForViewClass(viewClass);
                self.setAppState('selectedViewClass', viewclassName);
            }else{
                self.setAppState('selectedViewClass', undefined);
            }

        }, 'selectedViewClassListener');
    }


    //</editor-fold>
    //##################\\--App State--//##################

    bindMethods() {
        super.bindMethods();
        this.setSelectedViewClass = this.setSelectedViewClass.bind(this);
        this.onRunScriptButtonClick = this.onRunScriptButtonClick.bind(this);
        this.saveSVG = this.saveSVG.bind(this);
    }

    render(){

        const super_render = super.render();
        return (
            <div className={"row shape-tools-stage"} key={"row" +this.constructor.name}>
                <br></br>
                <div className={"container atoolpanel"}>
                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"d-inline-flex p-3 align-items-center align-self-center"}>
                            <SelectPicker
                                placeholder={"ViewClass"}
                                value={this.state.selectedViewClass}
                                onChange={this.setSelectedViewClass}
                                data={this.state.availableViewClassesDataItems}
                            />
                        </div>
                        <div className={"p-2 align-items-center align-self-center"}>
                            <button onClick = {this.onRunScriptButtonClick}>
                                RunScript
                            </button>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <button onClick={this.saveSVG}>SaveSVG</button>
                        </div>
                    </div>
                    {super_render}
                </div>
            </div>
        )
    }
}
