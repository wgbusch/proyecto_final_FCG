
function getStartId() {
    return utsx.getXLength() * (utsx.getZLength() - 1);
}

function getEndId(){
    return utsx.getXLength() -1;
}

function evaluatePath(list, callback) {
    if (list.length === 1) {
        list[0].evaluate().finally(() => {
            callback();
        });
        return;
    }
    list[0].evaluate().then(() => {
        evaluatePath(list.slice(1, list.length), callback);
    });
}

function FindEscapeRecursion(converter, start_id, start_direction, next_id) {
    if (next_id !== end_id) {
        let [movementInstructions, nextDirection] = converter.getNextDirection(start_id, start_direction, next_id);
        let callback = () => {
            start_id = next_id;
            next_id = converter.getRandomMovement(start_id);
            FindEscapeRecursion(converter, start_id, nextDirection, next_id);
        }
        evaluatePath(movementInstructions, callback);
    }
}

function FindEscape() {

    let converter = new Converter(utsx);
    let next_id = converter.getRandomMovement(start_id);

    FindEscapeRecursion(converter, start_id, new North(), next_id);
}
