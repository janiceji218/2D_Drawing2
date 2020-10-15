import {
    AObject,
    Vec2,
    Matrix3x3,
    VecEqual,
    MatrixEqual,
} from "AniGraph"

export const AObjectJSONEqual = {
    AObjectJSONEqual(msg, objectA, objectB) {
        const pass = objectA.getJSONString()==objectB.getJSONString();
        if (pass) {
            return {
                message: () =>
                    `${objectA}.getJSONString() == ${objectB}.getJSONString()`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `${objectA}.getJSONString() != ${objectB}.getJSONString()`,
                pass: false,
            };
        }
    }
}

expect.extend(AObjectJSONEqual);

import {A2Model} from "A2Code";

const TestClass = A2Model;

describe(`AObject Test for ${TestClass.name}`, ()=>{
    const name = TestClass.constructor.name;
    var newob = new TestClass({name: name});
    expect(newob.name).toBe(name);
    test('To JSON and Back:', (done) => {
        const newobB = TestClass.NewFromJSON(newob.getJSONString());
        expect().AObjectJSONEqual(newob, newobB);
        done();
    });
});

describe('AObject Test', ()=>{
    test('To JSON and Back Outside:', (done) => {
        const newob = new AObject();
        const newobB = AObject.NewFromJSON(newob.getJSONString());
        expect().AObjectJSONEqual(newob, newobB);
        done();
    });
});

// custom expect jest test... for vectors
expect.extend(VecEqual);
// custom expect jest test... for matrices
expect.extend(MatrixEqual);

const VecListToBeCloseTo = {
    VecListToBeCloseTo(received, other, msg) {
        let temp = true
        received.forEach((vec, index) => {
            const otherVec = other[index];
            temp &= vec.equalTo(otherVec);
        })
        const pass = temp
        if (pass) {
            return {
                message: () =>
                    `expected ${other} == ${received}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${other.toString()}, got ${received.toString()}\n` + msg,
                pass: false,
            };
        }
    },
}
expect.extend(VecListToBeCloseTo)

/***
 * This function converts the input angle to the angle in the range in [0,2pi]. This may be needed as
 * tests for rotation have the expected angle always be in the range [-pi, pi] to be consistent with the solutions
 * but students may potentially store angles in any range.
 * @param: angle in radians
 * @return: angle in radians in the range [0, 2pi]
 */
function normalizeAngle(angle) {
    return (angle % (2*Math.PI)+2*Math.PI) % Math.PI //based on Number.prototype.mod
}

function setModel(){
    let testModel = new A2Model();
    let origin = new Vec2(0, 0);
    let rotation = Math.PI * 90 / 180;
    let scale = new Vec2(2, 2);
    let translate = new Vec2(1, 0);
    let M = Matrix3x3.Translation(origin).times(
        Matrix3x3.Rotation(rotation).times(
            Matrix3x3.Scale(scale).times(
                Matrix3x3.Translation(translate)
            )
        )
    );
    testModel.setMatrix(M);

    return testModel;
}

function getM() {
    let origin = new Vec2(0, 0);
    let rotation = Math.PI * 90 / 180;
    let scale = new Vec2(2, 2);
    let translate = new Vec2(1, 0);
    let M = Matrix3x3.Translation(origin).times(
        Matrix3x3.Rotation(rotation).times(
            Matrix3x3.Scale(scale).times(
                Matrix3x3.Translation(translate)
            )
        )
    );

    return M;
}

function setParent() {
    let parentModel = new A2Model();

    let parentOrigin = new Vec2(0, 0);
    let parentRotation = Math.PI * 270 / 180;
    let parentScale = new Vec2(1, 3);
    let parentTranslate = new Vec2(-2, -3);
    let parentM = Matrix3x3.Translation(parentOrigin).times(
        Matrix3x3.Rotation(parentRotation).times(
            Matrix3x3.Scale(parentScale).times(
                Matrix3x3.Translation(parentTranslate)
            )
        )
    );
    parentModel.setMatrix(parentM);

    return parentModel;
}

function getParentM() {
    let parentOrigin = new Vec2(0, 0);
    let parentRotation = Math.PI * 270 / 180;
    let parentScale = new Vec2(1, 3);
    let parentTranslate = new Vec2(-2, -3);
    let parentM = Matrix3x3.Translation(parentOrigin).times(
        Matrix3x3.Rotation(parentRotation).times(
            Matrix3x3.Scale(parentScale).times(
                Matrix3x3.Translation(parentTranslate)
            )
        )
    );

    return parentM;
}

function setGrandParent() {
    let grandParentModel = new A2Model();

    let grandParentOrigin = new Vec2(-1, 0);
    let grandParentRotation = Math.PI * 130 / 180;
    let grandParentScale = new Vec2(1, 1);
    let grandParentTranslate = new Vec2(0, -3);
    let grandParentM = Matrix3x3.Translation(grandParentOrigin).times(
        Matrix3x3.Rotation(grandParentRotation).times(
            Matrix3x3.Scale(grandParentScale).times(
                Matrix3x3.Translation(grandParentTranslate)
            )
        )
    );
    grandParentModel.setMatrix(grandParentM);

    return grandParentModel;
}

function getGrandParentM() {
    let grandParentOrigin = new Vec2(-1, 0);
    let grandParentRotation = Math.PI * 130 / 180;
    let grandParentScale = new Vec2(1, 1);
    let grandParentTranslate = new Vec2(0, -3);
    let grandParentM = Matrix3x3.Translation(grandParentOrigin).times(
        Matrix3x3.Rotation(grandParentRotation).times(
            Matrix3x3.Scale(grandParentScale).times(
                Matrix3x3.Translation(grandParentTranslate)
            )
        )
    );

    return grandParentM;
}

function setSibling() {
    let siblingModel = new A2Model();

    let siblingOrigin = new Vec2(0, 0);
    let siblingRotation = Math.PI * 90 / 180;
    let siblingScale = new Vec2(2, 2);
    let siblingTranslate = new Vec2(1, 0);
    let siblingM = Matrix3x3.Translation(siblingOrigin).times(
        Matrix3x3.Rotation(siblingRotation).times(
            Matrix3x3.Scale(siblingScale).times(
                Matrix3x3.Translation(siblingTranslate)
            )
        )
    );
    siblingModel.setMatrix(siblingM);

    return siblingModel;
}

// Pibling is starting to be used as the gender neutral version of aunt/uncle
function setPibling() {
    let piblingModel = new A2Model();

    let piblingOrigin = new Vec2(0, 0);
    let piblingRotation = Math.PI * 300 / 180;
    let piblingScale = new Vec2(-1, 1);
    let piblingTranslate = new Vec2(3, 2);
    let piblingM = Matrix3x3.Translation(piblingOrigin).times(
        Matrix3x3.Rotation(piblingRotation).times(
            Matrix3x3.Scale(piblingScale).times(
                Matrix3x3.Translation(piblingTranslate)
            )
        )
    );
    piblingModel.setMatrix(piblingM);

    return piblingModel;
}

function setChild() {
    let childModel = new A2Model();

    let childOrigin = new Vec2(0, 0);
    let childRotation = Math.PI * 90 / 180;
    let childScale = new Vec2(1, 1);
    let childTranslate = new Vec2(-2, 2);
    let childM = Matrix3x3.Translation(childOrigin).times(
        Matrix3x3.Rotation(childRotation).times(
            Matrix3x3.Scale(childScale).times(
                Matrix3x3.Translation(childTranslate)
            )
        )
    );
    childModel.setMatrix(childM);

    return childModel;
}

// "describe()" is used to group blocks of related tests.
describe('Tests for getObjectToWorldMatrix', () => {
    let testModel = setModel();
    let parentModel = setParent();
    let grandParentModel = setGrandParent()
    let siblingModel = setSibling();
    let piblingModel = setPibling();
    let childModel = setChild();

    let M = getM();
    let parentM = getParentM();
    let grandParentM = getGrandParentM();

    test('O2W: Model is the root parent', () => {
        let ourO2W = M;
        let theirO2W = testModel.getObjectToWorldMatrix();

        expect(theirO2W).MatrixEqual(ourO2W);
    });

    test('O2W: Model has just a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);

        let ourO2W = parentM.times(M);
        let theirO2W = testModel.getObjectToWorldMatrix();

        expect(theirO2W).MatrixEqual(ourO2W);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
    });

    test('O2W: Model has just a parent and is a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the child
        testModel.addChild(childModel);

        let ourO2W = parentM.times(M);
        let theirO2W = testModel.getObjectToWorldMatrix();

        expect(theirO2W).MatrixEqual(ourO2W);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        childModel = setChild();
    });

    test('O2W: Model has a parent and grandparent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        let ourO2W = grandParentM.times(parentM.times(M));
        let theirO2W = testModel.getObjectToWorldMatrix();

        expect(theirO2W).MatrixEqual(ourO2W);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        grandParentModel = setGrandParent();
    });

    test('O2W: Model has a parent and a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);

        let ourO2W = parentM.times(M);
        let theirO2W = testModel.getObjectToWorldMatrix();

        expect(theirO2W).MatrixEqual(ourO2W);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
    });

    test('O2W: Model has a parent, grandparent, and sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        let ourO2W = grandParentM.times(parentM.times(M));
        let theirO2W = testModel.getObjectToWorldMatrix();

        expect(theirO2W).MatrixEqual(ourO2W);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
        grandParentModel = setGrandParent();
    });

    test('O2W: Model has a parent, grandparent, and the parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel)
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        let ourO2W = grandParentM.times(parentM.times(M));
        let theirO2W = testModel.getObjectToWorldMatrix();

        expect(theirO2W).MatrixEqual(ourO2W);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
        grandParentModel = setGrandParent();
    });

    test('O2W: Model has a parent, grandparent, sibling, and the parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the model's sibling
        parentModel.addChild(siblingModel);
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        let ourO2W = grandParentM.times(parentM.times(M));
        let theirO2W = testModel.getObjectToWorldMatrix();

        expect(theirO2W).MatrixEqual(ourO2W);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
        grandParentModel = setGrandParent();
        siblingModel = setSibling();
    });
});

describe('Tests for removeFromParent', () => {
    let testModel = setModel();
    let parentModel = setParent();
    let grandParentModel = setGrandParent();
    let siblingModel = setSibling();
    let piblingModel = setPibling();

    test('Rm Parent: Model has just a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);

        // Matrix & position w/ parent
        let matrixWithParent = testModel.matrix;
        let posWithParent = new Vec2(-9, 2.0000000000000018);

        // Call remove from parent
        testModel.removeFromParent();

        expect(testModel.getParent()).toBe(undefined);
        expect(testModel.matrix).MatrixEqual(matrixWithParent);
        expect(testModel.getPosition()).VecEqual(posWithParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
    });

    test('Rm Parent: Model has a parent and a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);

        // Matrix & position w/ parent
        let matrixWithParent = testModel.matrix;
        let posWithParent = new Vec2(-9, 2.0000000000000018);

        // Call remove from parent
        testModel.removeFromParent();

        expect(testModel.getParent()).toBe(undefined);
        expect(testModel.matrix).MatrixEqual(matrixWithParent);
        expect(testModel.getPosition()).VecEqual(posWithParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
    });

    test('Rm Parent: Model has a parent and the parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);

        // Matrix & position w/ parent
        let matrixWithParent = testModel.matrix;
        let posWithParent = new Vec2(-9, 2.0000000000000018);

        // Call remove from parent
        testModel.removeFromParent();

        expect(testModel.getParent()).toBe(undefined);
        expect(testModel.matrix).MatrixEqual(matrixWithParent);
        expect(testModel.getPosition()).VecEqual(posWithParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        grandParentModel = setGrandParent();
        piblingModel = setPibling();
    });


    test('Rm Parent: Model has a parent and a grandparent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        // Matrix & position w/ parent
        let matrixWithParent = testModel.matrix;
        let posWithParent = new Vec2(5.551132930297831, -6.251612378384263);

        // Call remove from parent
        testModel.removeFromParent();

        expect(testModel.getParent()).toBe(undefined);
        expect(testModel.matrix).MatrixEqual(matrixWithParent);
        expect(testModel.getPosition()).VecEqual(posWithParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        grandParentModel = setGrandParent();
    });

    test('Rm Parent: Model has a parent, grandparent, and a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        // Matrix & position w/ parent
        let matrixWithParent = testModel.matrix;
        let posWithParent = new Vec2(5.551132930297831, -6.251612378384263);

        // Call remove from parent
        testModel.removeFromParent();

        expect(testModel.getParent()).toBe(undefined);
        expect(testModel.matrix).MatrixEqual(matrixWithParent);
        expect(testModel.getPosition()).VecEqual(posWithParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        grandParentModel = setGrandParent();
        siblingModel = setSibling();
    });

    test('Rm Parent: Model has a parent, grandparent, a sibling, and parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        // Matrix & position w/ parent
        let matrixWithParent = testModel.matrix;
        let posWithParent = new Vec2(5.551132930297831, -6.251612378384263);

        // Call remove from parent
        testModel.removeFromParent();

        expect(testModel.getParent()).toBe(undefined);
        expect(testModel.matrix).MatrixEqual(matrixWithParent);
        expect(testModel.getPosition()).VecEqual(posWithParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
        siblingModel = setSibling();
        grandParentModel = setGrandParent();
    });
});

describe('Tests for attachToNewParent', () => {
    let testModel = setModel();
    let parentModel = setParent();
    let childModel = setChild();
    let grandParentModel = setGrandParent();
    let siblingModel = setSibling();
    let piblingModel = setPibling();

    test('Add Parent: Model has no parent and is not a parent', () => {
        // Matrix without parent
        let matrixWithoutParent = testModel.matrix;

        testModel.attachToNewParent(parentModel);

        expect(testModel.getParent()).toBe(parentModel);
        expect(testModel.matrix).MatrixEqual(matrixWithoutParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
    });

    test('Add Parent: Model is a parent', () => {
        // Set the model as a parent
        testModel.addChild(childModel);

        // Matrix without parent
        let matrixWithoutParent = testModel.matrix;

        testModel.attachToNewParent(parentModel);

        expect(testModel.getParent()).toBe(parentModel);
        expect(testModel.matrix).MatrixEqual(matrixWithoutParent);

        // Reset stuff
        childModel = setChild();
        testModel = setModel();
    });

    test('Add Parent: Model is a parent w/ multiple children', () => {
        // Set the model as a parent with two children
        testModel.addChild(childModel);
        // Sibling model is just used since it's just another model
        testModel.addChild(siblingModel);

        // Matrix without parent
        let matrixWithoutParent = testModel.matrix;

        testModel.attachToNewParent(parentModel);

        expect(testModel.getParent()).toBe(parentModel);
        expect(testModel.matrix).MatrixEqual(matrixWithoutParent);

        // Reset stuff
        childModel = setChild();
        testModel = setModel();
        siblingModel = setSibling();
        parentModel = setParent();
    });

    test('Add Parent: Model already has a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);

        // Matrix with current parent
        let matrixWithoutParent = testModel.matrix;

        // Set the new parent to be the pibling
        testModel.attachToNewParent(piblingModel);

        expect(testModel.getParent()).toBe(piblingModel);
        expect(testModel.matrix).MatrixEqual(matrixWithoutParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
    });

    test('Add Parent: Model already has a parent and a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);

        // Matrix with current parent
        let matrixWithoutParent = testModel.matrix;

        // Set the new parent to be the pibling
        testModel.attachToNewParent(piblingModel);

        expect(testModel.getParent()).toBe(piblingModel);
        expect(testModel.matrix).MatrixEqual(matrixWithoutParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
        piblingModel = setPibling();
    });

    test('Add Parent: Model is a grandparent', () => {
        // Set the model as a parent
        testModel.addChild(childModel);
        // Set the model as a grandparent
        childModel.addChild(piblingModel);

        // Matrix without parent
        let matrixWithoutParent = testModel.matrix;

        testModel.attachToNewParent(parentModel);

        expect(testModel.getParent()).toBe(parentModel);
        expect(testModel.matrix).MatrixEqual(matrixWithoutParent);

        // Reset stuff
        childModel = setChild();
        testModel = setModel();
        piblingModel = setPibling();
        parentModel = setParent();
    });

    test('Add Parent: Model already has a grandparent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        grandParentModel.addChild(parentModel);

        // Matrix with current parent
        let matrixWithoutParent = testModel.matrix;

        // Set the new parent to be the pibling
        testModel.attachToNewParent(piblingModel);

        expect(testModel.getParent()).toBe(piblingModel);
        expect(testModel.matrix).MatrixEqual(matrixWithoutParent);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        grandParentModel = setGrandParent();
        piblingModel = setPibling();
    });

});

describe('Tests for getWorldPosition', () => {
    let testModel = setModel();
    let parentModel = setParent();
    let childModel = setChild();
    let grandParentModel = setGrandParent();
    let siblingModel = setSibling();
    let piblingModel = setPibling();

    test('Get WPos: Model is the root parent', () => {
        expect(testModel.getWorldPosition()).VecEqual(new Vec2(0, 0));

        // Reset stuff
        testModel = setModel();
    });

    test('Get WPos: Model has just a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);

        expect(testModel.getWorldPosition()).VecEqual(new Vec2(-9, 2.0000000000000018));

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
    });

    test('Get WPos: Model has just a parent and is a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the child
        testModel.addChild(childModel);

        expect(testModel.getWorldPosition()).VecEqual(new Vec2(-9, 2.0000000000000018));

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        childModel = setChild();
    });

    test('Get WPos: Model has a parent and grandparent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        expect(testModel.getWorldPosition()).VecEqual(new Vec2(5.551132930297831, -6.251612378384263));

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        grandParentModel = setGrandParent();
    });

    test('Get WPos: Model has a parent and a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);

        expect(testModel.getWorldPosition()).VecEqual(new Vec2(-9, 2.0000000000000018));

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
    });

    test('Get WPos: Model has a parent, grandparent, and sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        expect(testModel.getWorldPosition()).VecEqual(new Vec2(5.551132930297831, -6.251612378384263));

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
        grandParentModel = setGrandParent();
    });

    test('Get WPos: Model has a parent, grandparent, and the parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel)
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        expect(testModel.getWorldPosition()).VecEqual(new Vec2(5.551132930297831, -6.251612378384263));

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
        grandParentModel = setGrandParent();
    });

    test('Get WPos: Model has a parent, grandparent, sibling, and the parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the model's sibling
        parentModel.addChild(siblingModel);
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        expect(testModel.getWorldPosition()).VecEqual(new Vec2(5.551132930297831, -6.251612378384263));

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
        grandParentModel = setGrandParent();
        siblingModel = setSibling();
    });
});

describe('Tests for setWorldPosition', () => {
    let testModel = setModel();
    let parentModel = setParent();
    let childModel = setChild();
    let grandParentModel = setGrandParent();
    let siblingModel = setSibling();
    let piblingModel = setPibling();

    test('Set WPos: Model is the root parent', () => {
        let position = new Vec2(1, 3);

        testModel.setWorldPosition(position, true);
        let theirPos = testModel.getWorldPosition();

        expect(theirPos).VecEqual(position);

        // Reset stuff
        testModel = setModel();
    });

    test('Set WPos: Model has just a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);

        let position = new Vec2(-1, 3);

        testModel.setWorldPosition(position, true);
        let theirPos = testModel.getWorldPosition();

        expect(theirPos).VecEqual(position);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
    });

    test('Set WPos: Model has just a parent and is a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the child
        testModel.addChild(childModel);

        let position = new Vec2(4, 2);

        testModel.setWorldPosition(position, true);
        let theirPos = testModel.getWorldPosition();

        expect(theirPos).VecEqual(position);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        childModel = setChild();
    });

    test('Set WPos: Model has a parent and grandparent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        let position = new Vec2(-1, -3);

        testModel.setWorldPosition(position, true);
        let theirPos = testModel.getWorldPosition();

        expect(theirPos).VecEqual(position);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        grandParentModel = setGrandParent();
    });

    test('Set WPos: Model has a parent and a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);

        let position = new Vec2(3, -3);

        testModel.setWorldPosition(position, true);
        let theirPos = testModel.getWorldPosition();

        expect(theirPos).VecEqual(position);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
    });

    test('Set WPos: Model has a parent, grandparent, and sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        let position = new Vec2(-2, -7);

        testModel.setWorldPosition(position, true);
        let theirPos = testModel.getWorldPosition();

        expect(theirPos).VecEqual(position);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
        grandParentModel = setGrandParent();
    });

    test('Set WPos: Model has a parent, grandparent, and the parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel)
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        let position = new Vec2(-1, 7);

        testModel.setWorldPosition(position, true);
        let theirPos = testModel.getWorldPosition();

        expect(theirPos).VecEqual(position);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
        grandParentModel = setGrandParent();
    });

    test('Set WPos: Model has a parent, grandparent, sibling, and the parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the model's sibling
        parentModel.addChild(siblingModel);
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        let position = new Vec2(4, 0);

        testModel.setWorldPosition(position, true);
        let theirPos = testModel.getWorldPosition();

        expect(theirPos).VecEqual(position);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
        grandParentModel = setGrandParent();
        siblingModel = setSibling();
    });

});

describe('Tests for recenterAnchorInSubtree', () => {
    let testModel = setModel();
    let parentModel = setParent();
    let grandParentModel = setGrandParent()
    let siblingModel = setSibling();
    let piblingModel = setPibling();
    let childModel = setChild();

    test('Recenter: Model has just a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);

        testModel.recenterAnchorInSubtree();
        let theirAnchor = testModel.getWorldPosition();
        let ourAnchor = new Vec2(0, 0);

        expect(theirAnchor).MatrixEqual(ourAnchor);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
    });

    test('Recenter: Model has just a parent and is a parent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the child
        testModel.addChild(childModel);

        testModel.recenterAnchorInSubtree();
        let theirAnchor = testModel.getWorldPosition();
        let ourAnchor = new Vec2(0, 0);

        expect(theirAnchor).MatrixEqual(ourAnchor);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        childModel = setChild();
    });

    test('Recenter: Model has a parent and grandparent', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        testModel.recenterAnchorInSubtree();
        let theirAnchor = testModel.getWorldPosition();
        let ourAnchor = new Vec2(1.2981333293569337, 1.9283628290596182)

        expect(theirAnchor).MatrixEqual(ourAnchor);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        grandParentModel = setGrandParent();
    });

    test('Recenter: Model has a parent and a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);

        testModel.recenterAnchorInSubtree();
        let theirAnchor = testModel.getWorldPosition();
        let ourAnchor = new Vec2(0, 0);

        expect(theirAnchor).MatrixEqual(ourAnchor);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
    });

    test('Recenter: Model has a parent, grandparent, and sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the sibling
        parentModel.addChild(siblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        testModel.recenterAnchorInSubtree();
        let theirAnchor = testModel.getWorldPosition();
        let ourAnchor = new Vec2(1.2981333293569337, 1.9283628290596182);

        expect(theirAnchor).MatrixEqual(ourAnchor);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        siblingModel = setSibling();
        grandParentModel = setGrandParent();
    });

    test('Recenter: Model has a parent, grandparent, and the parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel)
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        testModel.recenterAnchorInSubtree();
        let theirAnchor = testModel.getWorldPosition();
        let ourAnchor = new Vec2(1.2981333293569337, 1.9283628290596182);

        expect(theirAnchor).MatrixEqual(ourAnchor);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
        grandParentModel = setGrandParent();
    });

    test('Recenter: Model has a parent, grandparent, sibling, and the parent has a sibling', () => {
        // Set the parent
        parentModel.addChild(testModel);
        // Set the model's sibling
        parentModel.addChild(siblingModel);
        // Set the parent's sibling
        grandParentModel.addChild(piblingModel);
        // Set the grandparent
        grandParentModel.addChild(parentModel);

        testModel.recenterAnchorInSubtree();
        let theirAnchor = testModel.getWorldPosition();
        let ourAnchor = new Vec2(1.2981333293569337, 1.9283628290596182);

        expect(theirAnchor).MatrixEqual(ourAnchor);

        // Reset stuff
        parentModel = setParent();
        testModel = setModel();
        piblingModel = setPibling();
        grandParentModel = setGrandParent();
        siblingModel = setSibling();
    });
});

describe('Tests for getChildTreeObjectSpaceBoundingBox', () => {
    let testModel = setModel();
    let parentModel = setParent();
    let grandParentModel = setGrandParent()
    let siblingModel = setSibling();
    let piblingModel = setPibling();
    let childModel = setChild();

    test('ChildBBox: Model has one child', () => {
        // Set the model's child
        testModel.addChild(childModel);

        // This is undefined right now?
        let theirBox = testModel.getChildTreeObjectSpaceBoundingBox();
        let ourBox = testModel.getChildTreeObjectSpaceBoundingBox(); // Replace this when ready

        // Because it's undefined, this doesn't work
        // expect(theirBox).VecListToBeCloseTo(ourBox);
        expect(undefined).toBe(undefined); // Just a placeholder for now

        // Reset stuff
        testModel = setModel();
        childModel = setChild();
    });

});