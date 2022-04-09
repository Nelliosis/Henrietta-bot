/*
Copyright © 2022 by JavaScript Tutorial Website. All Right Reserved.
Modifications made by me:
- destroy
- retrieve
*/
class Queue {
    constructor() {
        this.head = 0;
        this.tail = 0;
        this.elements = [];
    }

    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }

    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }

    peek() {
        return this.elements[this.head];
    }

    destroy() {

        this.head = 0;
        this.tail = 0;
        this.elements = [];
        return;
    }

    retrieve() {
        return this.elements;
    }

    get size() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.size === 0;
    }

}
module.exports = Queue;
