import {
    AController2D
} from "AniGraph";


export default class A2CreativeModelController extends AController2D{

    onModelUpdate(args) {
        const self = this;
        switch (args.type){
            case 'setViewClass':
                self.replaceViewClass(args.viewClass);
                break;
            default:
                return super.onModelUpdate(args);
        }
    }
}