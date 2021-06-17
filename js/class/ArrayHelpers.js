class ArrayHelpers {
    static randomIndex(arr) {
        return Math.floor(Math.random() * arr.length);
    }
    static randomItem(arr) {
        return  arr[this.randomIndex(arr)];
    }
    static rangeNum(start, end, exclude = []) {
        let min = Math.min(start, end);
        let max = Math.max(start, end);
        let arr = new Array(max - min + 1);
        return arr.fill(0, 0).map((v, i) => min + i).filter((v) => !exclude.includes(v));
    }
}