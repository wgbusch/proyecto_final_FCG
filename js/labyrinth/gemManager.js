class GemManager {
    gems;
    GEM_SCORE = 10;

    constructor() {
        this.gems = new Map();
    }

    generateGems(proportion) {
        this.gems[0] = [0, 0];
        let size = numberOfXSquares * numberOfZSquares;
        let numberOfGems = Math.floor(size * proportion / 100);
        for (let i = 0; i < numberOfGems; i++) {
            let id = Math.floor(Math.random() * size);
            this.gems.set(id, this.getIndexes(id));
        }
    }

    consumeGemIfAny(id) {
        if (this.gems.has(id)) {
            this.gems.delete(id);
            return this.GEM_SCORE;
        }
        return 0;
    }

    hasGem(id) {
        return this.gems.has(id);
    }

    zIndex(id) {
        return Math.floor(id / numberOfXSquares);
    }

    xIndex(id) {
        return id % numberOfXSquares;
    }

    getIndexes(id) {
        return [this.xIndex(id), this.zIndex(id)];
    }

    getGemsIndexes() {
        return this.gems.values();
    }
}