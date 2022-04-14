/*
Copyright © 2022 by JavaScript Tutorial Website. All Right Reserved.
Modifications made by me:
- destroy
- retrieve
- current
- peek
- shuffle
*/
class Queue {
    constructor() {
        this.head = 0;
        this.tail = 0;
        this.current = {};
        this.elements = [];
    }

    enqueue(element) {
        this.elements.push(element);
        //this.elements[this.tail] = element;
        //this.tail++;
    }

    dequeue() {
        this.current = this.elements.shift();
        //delete this.elements[this.head];
        //this.head++;
        return this.current;
    }

    current() {
        return this.current;
    }

    /*peek() {
        return this.elements[this.head];
    }*/

    shuffle() {
        this.elements = this.elements.sort(() => Math.random() - 0.5);
        return;
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
        return this.elements.length;
    }

    get isEmpty() {
        return this.size === 0;
    }

}
module.exports = Queue;
