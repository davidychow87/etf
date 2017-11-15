var flag = true;
let start = new Date();
var count = 0;

import moment from 'moment';
// while (flag) {
//     count++;
//     if (count % 2000000 === 0) {
//         let now = new Date();
//         let diff = now - start;
//         console.log('Time is', diff/1000);
//         if (count === 200000000) {
//             count = 0;
//         }
//     }
// }

// setInterval(() => {
//     console.log('Now');
// }, 10)

// var array = [[1,2,3], [4,5,6], [7,8,9]];
// // console.log('Arr', array[1][2]);
// array.forEach(arr => {
//     console.log(arr);
// })

// function rotateClockwise(array) {
//     let size = array.length;
//     for (let x = 0; x < size/2; x++) {

//         for (let y = x; y < size-x-1; y++) {
//             let temp = array[x][y];

//             array[x][y] =  array[size-y-1][x];

//             array[size-y-1][x] = array[size-x-1][size-y-1];

//             array[size-x-1][size-y-1] = array[size-y-1][size-x-1]

//             array[size-y-1][size-x-1] = temp;
//         }
//     }
// }

// function rotateClockwise(array) {
//     let newArray = [];
//     let size = array.length;

//     //create empty array
//     for(let a = 0; a < size; a++) {
//         newArray.push([]);
//     }

//     // console.log(newArray);

//     for(let x = 0; x < size; x++) {
//         for (let y = 0; y < size; y++) {
//             newArray[y].unshift(array[x][y]);
//         }
//     }
//     console.log('newarray')
//     newArray.forEach(arr => {
//         console.log(arr);
//     })

// }

// rotateClockwise(array);
// console.log('Now');
// array.forEach(arr => {
//     console.log(arr);
// })

function node(end, func, next) {
    this.end = end;
    this.func = func;
    this.next = next;
}

export default class Timer {
    constructor() {
        this.start = new moment();
        this.time = 0;
        this.front = null;
        this.count = 0;
        while (true) {
            this.count++;

            if(this.count % 1000000 === 0) {
                let now = moment();
                console.log('TIme ds', now.diff(start, 'ms')/ 1000);
                this.count = 0;
            }
        }

        setInterval(() => {
            let now = moment();
            // this.time = (now - start) / 1000;
            // if (this.front !== null) console.log('time', now.format(), 'fronttime', this.front.end.format());
            if (this.front && now.diff(this.front.end) > 0) {
                console.log('NOW END', now.diff(this.front.end, 'ms'));
                this.front.func();
                this.front = this.front.next;
            }
        }, 100);
    }

    //time in ms
    timeOut (func, time) {
        let start = new moment();
        
        let end = start.add(time, 'ms');
        // console.log('end', end);
        // console.log('start', start);
        this.addNode(end, func);
    }

    addNode(end, func) {
        // console.log('Add node end', end);
        if (this.front === null) {
            console.log('Adding front', end.format());
            this.front = new node(end, func, null);
        } else {
            var current = this.front;

            while (current !== null) {
                console.log('else');
                //add to front if earliest
                if (end.diff(this.front.end) < 0) {
                    this.front = new node(end, func, this.front);
                    break;
                }

                if (end.diff(current.end) > 0 && current.next === null) {
                    current.next = new node(end, func, null);
                    break;
                }

                if (end.diff(current.end) > 0 && end.diff(current.next.end) < 0) {
                    let tail = current.next;
                    current.next = new node(end, func, tail);
                    break;
                }

                // if (end > current.end && current.next === null) {
                //     current.next = new node(end, func, null);
                //     break;
                // }

                // if (end > current.end && end < current.next.end) {
                //     let tail = current.next;
                //     current.next = new node(end, func, tail);
                //     break;
                // }
    
                current = current.next;
            }
        }
    }

}



