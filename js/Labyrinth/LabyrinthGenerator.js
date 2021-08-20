var labyrinthGenerator;

class LabyrinthGenerator {
    n;
    m;

    //n = rows
    //m = columns
    constructor(n, m) {
        this.n = n;
        this.m = m;
    }

    wilsonAlgorithm() {
        let n = this.n;
        let m = this.m;
        let uts = new Graph(n, m);
        uts.add(this.random(n * m));
        while (uts.size < n * m) {
            let randomWalk = this.generateRandomWalk(uts);
            uts.addWalk(randomWalk);
        }
        return uts;
    }

    pickNodeNotInUts(uts) {
        let n = this.n;
        let m = this.m;
        let randomNumber = this.random(n * m);
        while (uts.has(randomNumber)) {
            randomNumber = this.random(n * m);
        }
        return randomNumber;
    }

    random(range) {
        return Math.floor(Math.random() * range);
    }

    generateRandomWalk(uts) {
        let randomWalk = [];
        let previousNode = -1;
        let currentNode = this.pickNodeNotInUts(uts);
        randomWalk.push(currentNode);
        let n = this.n;
        let m = this.m;
        while (!uts.has(currentNode)) {
            let possibleMovementDirections = [];

            let row = uts.row(currentNode);
            let column = uts.column(currentNode);
            if (row > 0 && currentNode - m !== previousNode)
                possibleMovementDirections.push(currentNode - n);
            if (row < n - 1 && currentNode + m !== previousNode)
                possibleMovementDirections.push(currentNode + n)
            if (column > 0 && currentNode - 1 !== previousNode)
                possibleMovementDirections.push(currentNode - 1)
            if (column < m - 1 && currentNode + 1 !== previousNode)
                possibleMovementDirections.push(currentNode + 1)
            let nextNode = possibleMovementDirections[this.random(possibleMovementDirections.length)];

            if (!this.makesALoop(nextNode, randomWalk)) {
                randomWalk.push(nextNode);
            } else {
                randomWalk = this.removeLoop(nextNode, randomWalk);
            }
            previousNode = currentNode;
            currentNode = nextNode;
        }
        return randomWalk;
    }

    makesALoop(nextEdge, randomWalk) {
        return randomWalk.includes(nextEdge);
    }

    removeLoop(nextEdge, randomWalk) {
        for (let i = randomWalk.length - 1; i >= 0; i--) {
            if (randomWalk[i] === nextEdge) {
                randomWalk = randomWalk.slice(0, i);
                randomWalk.push(nextEdge);
                break;
            }
        }
        return randomWalk;
    }

    test() {
        let testCases_makes_a_loop = []
        testCases_makes_a_loop.push([[5, 0], [0, 1, 6, 5], true]);
        testCases_makes_a_loop.push([[16, 21], [20, 21, 22, 23, 18, 17, 16], true]);
        testCases_makes_a_loop.push([[7, 2], [1, 0, 1, 2, 1, 6, 11, 16, 17, 12, 7], true]);
        testCases_makes_a_loop.push([[23, 18], [17, 18, 19, 14, 19, 24, 23], true]);

        testCases_makes_a_loop.push([[23, 24], [20, 21, 22, 23], false]);
        testCases_makes_a_loop.push([[6, 5], [0, 1, 6], false]);
        testCases_makes_a_loop.push([[0, 5], [1, 0], false]);

        console.log("---Test makes a loop------");
        for (let i = 0; i < testCases_makes_a_loop.length; i++) {
            let testCase = testCases_makes_a_loop[i];
            console.log("Result: " + this.makesALoop(testCase[0], testCase[1]) + " --- Expected: " + testCase[2]);
        }

        console.log("---Test remove loop------");
        let testCases_remove_loop = []
        testCases_remove_loop.push([[5, 0], [0, 1, 6, 5], [0]]);
        testCases_remove_loop.push([[16, 21], [20, 21, 22, 23, 18, 17, 16], [20, 21]]);
        testCases_remove_loop.push([[5, 0], [1, 0, 5], [1, 0]]);
        testCases_remove_loop.push([[0, 1], [1, 0], [1]]);

        for (let i = 0; i < testCases_remove_loop.length; i++) {
            let testCase = testCases_remove_loop[i];
            console.log("Result: " + this.removeLoop(testCase[0], testCase[1]) + " --- Expected: " + testCase[2]);
        }


    }
}