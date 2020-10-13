import {
    Matrix3x3,
    Vec2,
    Precision,
    ADragInteraction,
    ADragValueInteraction
} from "AniGraph"



/**
 * Below you will implement interactions that work on models in a transformation hierarchy (scene graph)
 *
 * *****HINT: In this version of AniGraph, interactions are written slightly differently to how they were in A1. To see
 * an example of what the A1 interactions look like in this newer version, read through ReferenceA1InteractionImplementations.js
 * This will help you get a better sense of how you will want to approach writing the interactions for this A2.
 */

export class DragToScaleAroundWorldPointInteraction extends ADragInteraction{
    /**
     * Creates a drag interaction for scaling the controller's model around a specified point
     * based on the value returned by getValue (in general, we assume these
     * represent the same value, but they need not necessarily).
     * Example args dictionary:
     * ``` javascript
     * args = {
     *     name: 'drag-position',
     *     element: myShape,
     *     controller: myController
     * }
     * ```
     * @param args
     * @returns {*}
     * @constructor
     */
    static Create(args){
        // Use the super class's Create function to instantiate the AInteraction subclass that we will return
        const interaction = super.Create(args);

        // Define the drag start callback
        interaction.setDragStartCallback(event=>{
            if(!interaction.elementIsTarget(event)){return;}
            event.preventDefault();
            //A2 Implement
            interaction.startCursor = interaction.getEventPositionInContext(event);

            interaction.parentMatrix = interaction.controller.getModel().getParent().matrix;
            interaction.worldToParentMatrix = interaction.controller.getModel().getParent().getWorldToObjectMatrix();
            interaction.parentToWorldMatrix = interaction.controller.getModel().getParent().getObjectToWorldMatrix();

            interaction.startTransformOrigin = interaction.controller.getModel().getPosition();
            interaction.scaleSpace=
                interaction.parentToWorldMatrix.times(
                    Matrix3x3.Translation(interaction.startTransformOrigin).times(
                        Matrix3x3.Rotation(interaction.controller.getModel().getRotation())
                    ))

            interaction.scaleSpacei=interaction.scaleSpace.getInverse();
            interaction.startMatrix = interaction.controller.getModel().matrix;

            interaction.TR=Matrix3x3.Translation(interaction.startTransformOrigin).times(
                Matrix3x3.Rotation(interaction.controller.getModel().getRotation())
            );

            interaction.RiTi=interaction.TR.getInverse();

            interaction.startCursorScaleCoords = interaction.scaleSpacei.times(interaction.startCursor);
            interaction.origScale = interaction.controller.getModel().getScale();
        });

        // Now define a drag move callback
        interaction.setDragMoveCallback(event=> {
            event.preventDefault();
            //A2 Implement

            const newCursor = interaction.scaleSpacei.times(interaction.getEventPositionInContext(event));

            const denomX = Precision.signedTiny(interaction.startCursorScaleCoords.x);
            const denomY = Precision.signedTiny(interaction.startCursorScaleCoords.y);
            var rescaleX = Precision.signedTiny(newCursor.x)/denomX;
            var rescaleY = Precision.signedTiny(newCursor.y)/denomY;

            if(event.shiftKey != !!interaction.controller.getModel().isModelGroup){
                const absval = Math.max(Math.abs(Precision.signedTiny(rescaleX)), Math.abs(Precision.signedTiny(rescaleY)));
                rescaleX = rescaleX<0? -absval : absval;
                rescaleY = rescaleY<0? -absval : absval;
            }

            interaction.controller.getModel().setMatrix(interaction.TR.times(
                Matrix3x3.Scale(rescaleX, rescaleY)).times(
                interaction.RiTi
                ).times(interaction.startMatrix)
            );

        });

        // We can optionally define a drag end callback
        interaction.setDragEndCallback(event=>{
            event.preventDefault();
        });

        // Finally, return the interaction
        return interaction;
    }

    /**
     * We can override this function in subclasses to transform around different points
     * @returns {Vec2}
     */
    getTransformOriginInWorldCoordinates(){
        return new Vec2(0,0);
    }
}

export class AIDragToMovePosition extends ADragValueInteraction{
    getValueFunction(){
        //A2 Implement
        return this.controller.getModel().getWorldPosition();
    }

    setValueFunction(value){
        this.controller.getModel().setWorldPosition(value);
    }
}

export class AIDragToMoveAnchorPoint extends ADragValueInteraction{
    getValueFunction(){
        //A2 Implement
        return this.controller.getModel().getWorldPosition();
    }

    setValueFunction(value){
        this.controller.getModel().setWorldPosition(value, false);
        this.controller.getModel().updateMatrixProperties();
    }
}


//##################//--The rest (below) is provided and need not be changed--\\##################
//<editor-fold desc="The rest is provided for convenience">

// Style Note: For AInteraction subclasses that are ready-to-use (rather than intended for use in constructing
// more complicated custom interaction), I generally put 'AI' at the beginning of the class name
// and omit 'Interaction' at the end. For parent classes that templatize common functionality, I
// include 'Interaction' in the class name.
//

export class AIDragToScaleAroundModelAnchor extends DragToScaleAroundWorldPointInteraction{
    /**
     * We need only redefine our transform origin to get the handle interaction from A1TransformController
     * @returns {*}
     */
    getTransformOriginInWorldCoordinates(){
        return this.controller.getModel().getWorldPosition();
    }
}

export class AIDragToScaleAroundBoundingBoxCenter extends DragToScaleAroundWorldPointInteraction{
    /**
     * We need only redefine our transform origin to get the center of our object's bounding box to implement
     * the handle interaction from our A1TransformCenteredController
     * @returns {Vec3|Vec2|Matrix3x3}
     */
    getTransformOriginInWorldCoordinates(){
        const corners = this.controller.getModel().getWorldSpaceBBoxCorners();
        return corners[0].plus(corners[2]).times(0.5);
    }
}
//</editor-fold>
//##################\\--provided for convenience--//##################



