
import {
    Vec2,
    Matrix3x3,
    AModel2D,
    AObject
} from "AniGraph"
import Vec3 from "../../../../assignment0/src/math/Vec3";

export default class A2Model extends AModel2D{

    //##################//--Below Functions are Provided (You shouldn't need to change these, but looking at them might be useful)-\\##################
    //<editor-fold desc="Provided Functions (You shouldn't need to change these, but looking at them might be useful)">

    /**
     * Throughout this assignment, it can be easy to lose track of what behavior to
     * expect from different operations under different circumstances. As is often the
     * case with hierarchical algorithms, it's useful to approach things inductively.
     * Most of the behavior in this assignment reduces to what you implemented in
     * Assignment 1 when all objects are children of the same root node (assuming
     * that root node has the identity as its matrix).<br>
     *
     * For this reason, it will often be useful to think of the behavior at each node
     * in the object coordinates of its parent. To that end, the following simple
     * function may prove handy.
     *
     * @returns {Matrix3x3}
     */
    getParentSpaceMatrix(){
        if(this.getParent()){
            // You will reimplement getObjectToWorldMatrix later in this file
            return this.getParent().getObjectToWorldMatrix();
        }else{
            return Matrix3x3.Identity();
        }
    }



    /**
     * We are going to transform our points by the object to world matrix instead of just by the object matrix
     * @returns {*|undefined}
     */
    getVertices() {
        return this.objectVertices? this.getObjectToWorldMatrix().applyToPoints(this.objectVertices): undefined;
    }

    /**
     * You can find a slightly adapted version of our own reference solution from assignment 1 in AModel2D
     * We've changed it to use getWorldToObjectMatrix instead of this.matrix.getInverse() to make it
     * forward compatible with assignment 2.
     * @param value
     */
    setVertices(value) {
        return super.setVertices(value);
    }

    /**
     * We edit this function to use getObjectToWorldMatrix instead of this.matrix
     * @returns {*}
     */
    getWorldSpaceBBoxCorners(){
        return this.getObjectToWorldMatrix().applyToPoints(this.objectSpaceCorners);
    }

    /**
     * Get the bounding box for the entire subtree of children rooted at this model.
     * You will implement the getChildTreeObjectSpaceBoundingBox() function in the code
     * at the bottom of this file.
     *
     * If the model has no geometry and no children with geometry, then this function should
     * not return anything (or equivalently, return `undefined`).
     * Returns nothing if getChildTreeObjectSpaceBoundingBox returns nothing
     * @returns {*}
     */
    getChildTreeWorldSpaceBoundingBox(){
        const objectSpaceBoxPoints = this.getChildTreeObjectSpaceBoundingBox();
        if(objectSpaceBoxPoints) {
            return this.getObjectToWorldMatrix().applyToPoints(objectSpaceBoxPoints);
        }
    }

    /**
     * A function for getting the bounds of every element sharing a common ancestor.
     * This is similar to the bounds displayed when selecting by group in apps like Powerpoint.
     * @returns {*}
     */
    getGroupWorldSpaceBoundingBox(){
        function groupRoot(m){
            if(m.getParent() && m.getParent().getParent()){
                return groupRoot(m.getParent());
            }else{
                return m;
            }
        }
        return groupRoot(this).getChildTreeWorldSpaceBoundingBox();
    }

    /**
     * The reparent operation detaches a subtree from its parent, and re-attaches it elsewhere.
     * You will have to write code that handles the impact of these edits on object matrices in the definitions of
     * removeFromParent() and attachToNewParent(newParent), found later in this file.
     * @param newParent
     */
    reparent(newParent){
        this.removeFromParent();
        this.attachToNewParent(newParent);
    }

    /**
     * groupChildren will take all the children of a node and reparent them to a new A2ModelGroup,
     * which will then be the only child of this model. After calling this function, all previous
     * children should be grandchildren, and the only child of the current model should be the new
     * AGroupModel.
     *
     * You will need to write the function recenterAnchorInSubtree() which is called at the end of
     * this function to set the position of the new group.
     */
    groupChildren(){
        const newGroup = this.constructor.CreateGroup();
        const childList = this.getChildrenList();
        this.addChild(newGroup);
        for(let c of childList){
            c.reparent(newGroup);
        }
        newGroup.recenterAnchorInSubtree();
        return newGroup;
    }


    /**
     * Ungroup children is *almost* an inverse of groupChildren. More specifically,
     * if you call `this.groupChildren().ungroupChildren()`, then you should end up
     * with the same graph you started with. More generally, you can use ungroupChildren
     * to remove the dependencies of a node's children from that node.
     */
    ungroupChildren(){
        // Can't ungroup children of root node...
        if(!this.getParent()){
            return;
        }
        const childList = this.getChildrenList();
        for(let c of childList){
            c.reparent(this.getParent());
        }
        return this;
    }



    //</editor-fold>
    //##################\\--Above Functions are Provided (You shouldn't need to change these, but looking at them might be useful)--//##################
    //---------------------------------------------------------------------------------------------------------------------------------------

    //################################################################################################################################################################
    //######################################################//--Implement missing code in the section below--\\/######################################################
    //################################################################################################################################################################
    //<editor-fold desc="Functions for You to Implement">

    /**
     * Should calculate the matrix that transforms object coordinates to world (pixel) coordinates
     * In this case, remember that our models form a scene graph, with world coordinates
     * corresponding to the coordinate system at the root of our scene graph.
     *
     * The transformation matrix, say we name it M_toWorld, that transforms points on the selected
     * model M to the world coordinate is given by M_toWorld = Parent's M_toWorld * M's model matrix.
     *
     * In other words, if we have the following model hierarchy p_root -> p_1 ->  p.
     * The vertex v of model p in world coordinate is given by Mp_root * Mp_1 * Mp * v
     *
     * Thus, we can get objectToWorldMatrix M_toWorld by calling a recursive method until we reach the
     * root node in the scene graph.
     *
     * Note that the M_toWorld of the root model M_root is simply M_root's model matrix.
     * @returns {*}
     */
    getObjectToWorldMatrix(){
        //A2 Implement
        let mat = this.matrix;
        if (!this.getParent())
            return mat;
        else
            return this.getParent().getObjectToWorldMatrix().times(mat);

        //you should REPLACE the line below with your own code.
        //return super.getObjectToWorldMatrix();
    }

    //The inverse transformation: WorldToObject is defined as below.
    getWorldToObjectMatrix(){return this.getObjectToWorldMatrix().getInverse();}


    /**
     * super.removeFromParent() will remove this model from its parent's children, and set this model's parent property
     * to be undefined (no parent).
     *
     * Note that different from the M = ORST model we had from A1, we have M = PRSA in A2 where P is referred to as Position.
     * And conceptually, P is used to move a child's anchor from origin (0,0) to the anchor position in the parent's
     * coordinate system (not the world!). And we can retrieve this position by doing this.getPosition.
     *
     * And since the anchor position is in the parent's coordinate removing a model from its parent will change the
     * value of its ObjectToWorldMatrix (retrieved using this.getObjectToWorldMatrix() ) and thus change the
     * position of the shape.
     *
     * However, we do not want this operation to change the shape on our canvas.
     * To ensure this, we will need to change our model's object matrix and Position.
     *
     * Hint: Think about how removing from the parent will change the Position & ObjectToWorldMatrix of the model
     * and what should we do to counteract the effect.
     *
     * Hint: Consider using setMatrixAndPosition and think about what values should be passed in.
     */
    removeFromParent() {
        //A2 Implement
        let toWorld = this.getObjectToWorldMatrix();
        let newPos = this.getParentSpaceMatrix().times(this.getPosition());
        this.setParent(undefined);
        this.setMatrixAndPosition(toWorld, newPos);
        super.removeFromParent(); // Do NOT delete this line! Add your code above it.
    }

    /**
     * Here we attach the selected model to the given parent.
     *
     * Similar to removeFromParent, our job is to ensure that the worldpositions of our model
     * (retrieved using this.getWorldPosition you will implement) remain consistent after the attachment.
     *
     * Hint: Think about how adding a parent will change the Position & ObjectToWorldMatrix of the model and what
     * should we do to counteract the effect.
     *
     * @param newParent
     */
    attachToNewParent(newParent) {
        //A2 Implement
        let toWorld = newParent.getObjectToWorldMatrix().getInverse().times(this.getObjectToWorldMatrix());
        let newPos = newParent.getObjectToWorldMatrix().getInverse().times(this.getPosition());
        this.setMatrixAndPosition(toWorld, newPos);
        super.attachToNewParent(newParent); // Do not delete this line! Add your code above it.
    }

    /**
     * Now that a model's matrix may not map directly to world coordinates, we may need an additional step
     * to calculate position on the screen.
     * Hint: you can retrieve the model's position by this.getPosition().
     *       What is this position? (refer to earlier comments if you are confused)
     * Hint: what should you do if the model has no parent? What should you do if the model has a parent?
     * @returns {*}
     */
    getWorldPosition() {
        if (!this.getParent()){
            return this.getPosition();
        }
        return this.getParentSpaceMatrix().times(this.getPosition());
    }

    /**
     * Set the position of this model such that subsequent transformations will
     * happen around the provided point, which is given in world coordinates.
     *
     * Hint: Given Position in WorldSpace, set the model's position by calling this.setPosition(someposition, update).
     * Hint: What should this "someposition" be if the model has no parent? What if the model has a parent?
     *
     * @param position
     * @param update
     */
    setWorldPosition(position, update= true){
        if (!this.getParent()){
            this.setPosition(position, update)
        }
        else {
            this.setPosition(this.getParentSpaceMatrix().getInverse().times(position), update);
        }
    }

    /**
     * In our hierarchy, when we group up shapes, we create a model Mg that is the parent of all the shapes in the group.
     * This function sets the World Position of the group model Mg to be the center of the bounding box of all models
     * within the group, without changing the world space vertices of any model in the scene.
     *
     * If Mg is a group with no children, set the world position to be the same as the model's parent's world position.
     *
     * Hint: you can get the child bounding box through this.getChildTreeWorldSpaceBoundingBox (you will implement it next).
     *
     */
    recenterAnchorInSubtree(){
        //A2 Implement
        let bounds = this.getChildTreeWorldSpaceBoundingBox();
        let x = (bounds[0].x + bounds[1].x) / 2.0;
        let y = (bounds[0].y + bounds[3].y) / 2.0;

    }


    /**
     * Calculates the corners of a bounding box for this model and its entire tree of descendants. The returned bounding
     * box should be in the object space coordinates of this model. For example, if a model has no children, then this
     * function should return this.objectSpaceCorners.
     *
     * Note that this.children is not a list; it's a javascript Map, which you can think of as an ordered dictionary.
     * If you're not familiar with javascript Maps, we recommend iterating over children using one of the following methods:
     * <br>
     * getChildrenList() will return a list of children that you can iterate over:
     *
     * ```javascript
     * const childList = this.getChildrenList();
     * ```
     *
     * mapOverChildren(fn) will apply the function fn to each child:
     *
     * ```javascript
     * this.mapOverChildren(child=>{
     *      //some code function on child
     * })
     * ```
     *
     * Hint: The function vec2.GetPointBounds(pointList) might be helpful
     * Hint: Remember to keep track of what space all the vertices are in and perform any necessary transformations
     * Hint: You will want the function to be recursive
     *
     * Should be in the form:
     * [Vec2(minX, minY),
     * Vec2(maxX, minY),
     * Vec2(maxX, maxY),
     * Vec2(minX, maxY)]
     * @returns {Vec2[]}
     */


    getChildTreeObjectSpaceBoundingBox(){
        //A2 Implement
        let pts = this.objectSpaceCorners;

        if (this.getChildrenList().length === 0){
            let minX = Vec2.GetPointBounds(pts)[0].x;
            let minY = Vec2.GetPointBounds(pts)[0].y;
            let maxX = Vec2.GetPointBounds(pts)[1].x;
            let maxY = Vec2.GetPointBounds(pts)[1].y;

            return [
                new Vec2(minX, minY),
                new Vec2(maxX, minY),
                new Vec2(maxX, maxY),
                new Vec2(minX, maxY)
            ]
        }

        let childrenPts = this.mapOverChildren(child => {return child.matrix.applyToPoints(child.getChildTreeObjectSpaceBoundingBox())});
        pts.concat(childrenPts);
    }
    //################################################################################################################################################################
    //######################################################\\--Implement missing code in the section above--///######################################################
    //################################################################################################################################################################

    /**
     * This function will create an A2ModelGroup (defined below).
     * You do not need to change this function.
     * @param args
     * @returns {A2ModelGroup}
     * @constructor
     */
    static CreateGroup(args){
        return new this.GroupClass(args);
    }
}

//##################//--Model Group Class--\\##################
//<editor-fold desc="Model Group Class">

/**
 * Below you will find the A2ModelGroup class. You don't need to edit it,
 * but are welcome to look at its implementation. Its main purposes are to
 * 1) Provide a way to add transformations to the hierarchy without adding
 * additional geometry, and 2) provide a mechanism for adding transformations
 * to an object that its children should not inherit (see video for details).
 */
export class A2ModelGroup extends A2Model{
    /**
     * Convenience accessor to see if a model is an A2ModelGroup. So, `model.isModelGroup` will be
     * true if model is an AModelGroup
     * @return {boolean}
     * */
    get isModelGroup(){return true;}

    getWorldSpaceBBoxCorners() {
        if(!this.getChildrenList().length){
            return;
        }
        return this.getChildTreeWorldSpaceBoundingBox();
    }

    /**
     * Groups cannot have their own vertices. They exist only for manipulating other shapes.
     * It is a grim existence: living only to serve others, trapped in the shadows of a
     * hierarchical system... Take a moment to ponder this. Then, perhaps, have a quick stretch.
     * After that, you should probably get back to work on the assignment. Also, now that we've
     * personified model groups, try not to think too much about how that analogy plays out in
     * the implementation for ungroupChildren(). There is enough darkness in the world today;
     * you don't need some kind of imagined ethical dilemma adding to the madness.
     * @param value
     */
    setVertices(value) {
        return;
    }

    /**
     * ungroupChildren works slightly differently on groups than on regular models,
     * in that we remove the group node after promoting its children to siblings.
     * This ensures that `model.groupChildren().ungroupChildren()` leaves the graph unchanged,
     * and brings the fleeting life of an A2ModelGroup to an abrupt end. Don't think about that
     * last part too hard; in the words of Albert Camus, "to understand the world, one has to
     * turn away from it on occasion."
     * @returns {*}
     */
    ungroupChildren() {
        const parent = this.getParent();
        if(!parent){
            return;
        }
        super.ungroupChildren();
        this.release();
        return parent;
    }
}
A2Model.GroupClass = A2ModelGroup
//</editor-fold>
//##################\\--Model Group Class--//##################

AObject.RegisterClass(A2Model);
AObject.RegisterClass(A2ModelGroup);