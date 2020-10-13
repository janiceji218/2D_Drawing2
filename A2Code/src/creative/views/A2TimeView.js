import {Vec2, P2D, Matrix3x3, AView2D} from "AniGraph";
import tinycolor from "tinycolor2";


export default class A2TimeView extends AView2D{
    initGraphics() {
        super.initGraphics();
    }

    makeParticle(sidelen=10){
        return this.createShapeWithVertices(this.particleVerts(P2D(0,0)), sidelen);
    }

    particleVerts(location, sidelen=10, rotation=0){
        const h = 0.86602540378*sidelen;
        const offset = location? location : P2D(0,0);
        var verts = [
            P2D(-sidelen*0.5,-h/3),
            P2D(sidelen*0.5,-h/3),
            P2D(0,h*2/3)
        ];
        return Matrix3x3.Translation(offset).times(Matrix3x3.Rotation(rotation)).applyToPoints(verts);
    }

    initGeometry() {
        super.initGeometry();
        this.nParticles = 25;
        this.particles = [];

        //Here you can access the controls you specified in ../creative.jsx
        // e.g.,:
        // const modelProp1 = this.getModel().getProperty("ColorChangeFreq");
        // const modelProp2 = this.getModel().getProperty("OtherModelProp");
        // const appProp1 = this.getComponentAppState('AppProp1');

    }

    updateViewElements(){
        super.updateViewElements();//updates the original shape. You can remove this if you remove the original shape.

        //Here you can access the controls you specified in ../creative.jsx
        // e.g.,:
        // const modelProp1 = this.getModel().getProperty("ColorChangeFreq");
        // const modelProp2 = this.getModel().getProperty("OtherModelProp");
        // const appProp1 = this.getComponentAppState('AppProp1');

        // To access the current time
        var time = this.getComponentAppState('appTime');
        time = (time!==undefined)? time : 0;


        const model = this.getModel();
        const freq =model.getProperty('ColorChangeFreq');
        const period = 1000/freq;
        var phase = (time%period)/period;

        var color = tinycolor(model.getAttribute('fill'));
        color = color.spin(phase*360); // tinycolor is weird; it uses degrees instead of radians...
        this.shape.setAttribute('fill', color.toString());
    }
}