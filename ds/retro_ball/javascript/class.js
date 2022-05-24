//all the classes

/**
 * @classdesc the soccer ball
 * @class
 */
class Ball {
  /**
   * gives the ball a size, position and velocity, as well as boundaries for acceleration/deceleration and speed
   * @param {number} x the x coordinate to spawn the ball
   * @param {number} y the y coordinate to spawn the ball
   * @constructor
   * @time O(1)
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xVel = 0;
    this.yVel = 0;
    this.decel = 0.1;
    this.size = 6;
    this.maxSpeed = 6;
  }
  /**
   * checks to see if velocities exceeds maximum speed bounds
   * @time O(1)
   */
  checkBounds() {
    if (this.xVel > this.maxSpeed) {
      this.xVel = this.maxSpeed
    } else if (this.xVel < -this.maxSpeed) {
      this.xVel = -this.maxSpeed
    }
    if (this.yVel > this.maxSpeed) {
      this.yVel = this.maxSpeed
    } else if (this.yVel < -this.maxSpeed) {
      this.yVel = -this.maxSpeed
    }
  }
}

/**
 * @classdesc a singly-linked list consisting of nodes accessed through the head node
 * @class
 */
class LinkedList {

  /**
   * @classdesc Nodes in a linked list
   * @class
   */
  static Node = class {
    /**
     * makes a new node containing data and a pointer pointing to null
     * @param {*} data the data to set in the node
     * @constructor 
     * @time O(1)
     * @space O(1)
     */
    constructor(data) {
      this.data = data;
      this.next = null
    }
  }

  /**
   * Initializes an empty linked list
   * @constructor
   * @time O(1)
   * @space O(1)
   */
  constructor() {
    this.head = new LinkedList.Node(null);
    this.length = 0;
  }

  /**
   * Prohibits setting the size of the linked list
   * @param {number} newSize new size of the linked list
   * @time O(1)
   * @space O(1)
   */
  set size(newSize) {
    throw "Size is a read-only attribute and shouldn't be set externally."
  }

  /**
   * Gets the size of the linked list
   * @time O(1)
   * @space O(1)
   */
  get size() {
    return this.length
  }

  /**
   * Provides an iterator for the linked list
   * @return an JS5 standard iterator
   * @time O(1)
   * @space O(1)
   */
  [Symbol.iterator]() {
    let current = this.head.next;

    return {
      /**
       * checks if we are at the end of the linked list
       * @returns if we are done with iteration and the iterated node's data
       */
      next: () => {
        //once we hit the end no longer iterate to the next
        if (current == null) {
          return {
            value: undefined,
            done: true
          };
        }

        //if we aren't at the end keep iterating
        let result = {
          value: current.data,
          done: false
        }
        current = current.next;
        return result;
      }
    }
  }

  /**
   * Add to the end of the linked list 
   * @param {*} data the data to add to the list
   * @param {boolean} returns true on success, false otherwise
   * @time O(n)
   * @space O(1)
   */
  add(data) {

    // creates a new node
    let node = new LinkedList.Node(data), current;


    // if list is Empty add the data by making it the head
    if (this.head == null) {
      this.head = node;
    }
    else {
      current = this.head;
      // iterate to the end of the list
      while (current.next) {
        current = current.next;
      }
      // add node after the last node
      current.next = node;

    }
    this.length++
  }



  /**
   * Inserts data into the list after the index provided.
   * @param data the data to insert into the linked list
   * @param place the index to insert after. -1 indicates before head, > size indicates at the end of the list
   * @return true on success, false otherwise
   * @time O(n)
   * @space O(1)
   */
  insert(data, place = -1) {
    if (place > this.size) {
      this.add(data);
    }

    //if we are out of bounds
    if (place >= 0 && place <= this.size) {
      let node = new LinkedList.Node(data),
        current = this.head,
        previous,
        index = 0;
      if (place == -1) {
        node.next = current;
        head = null;
      } else {
        while (index++ < place) {
          previous = current;
          current = current.next;
        }
        node.next = current.next;
        current.next = node;
      }
      this.length++
    }
  }

  /**
   * Removes an element from the list at the index provided.
   * @param place index to remove; <= 0 indicates removal of first element; > size indicates removal of last element
   * @return the data that was removed
   * @time O(n)
   * @space O(1)
   */
  remove(place = -1) {
    //make sure vals are in bounds
    let current = this.head,
      previous,
      index = 0;
    //removes first
    if (place <= 0) {
      this.head = current.next;
      this.length = this.length - 1;
      return;
    }
    //removes last
    if (place >= this.length) {
      while (current !== null) {
        previous = current;
        current = current.next;
      }
      previous.next = null;
      this.length--;
      return previous.data;
    } else {
      while (index++ < place) {
        previous = current;
        current = current.next;
      }
      previous.next = current.next;
    }
    this.length--;
    return current.data
  }


  /**
   * Gets the data from a provided index (stating at index zero)
   * @param place the index to retreive data from
   * @return the data at index {place} or null if doesn't exist
   * @time O(n)
   * @space O(1)
   */
  get(place = 0) {
    //checks for out of bounds
    if (place < 0 || place > this.length || this.length == 0) {
      return null;
    }
    let current = this.head.next;
    let index = 0;
    while (index < place) {
      index++;
      current = current.next;
    }
    return current.data;
  }
}

/**
 * @clasdesc each player on the field, including goalkeepers
 * @class
 */
class Player {
  /**
   * sets the position, size, velocity and bounds for acceleration/deceleration and speed
   * @param {number} x the x coordinate of this player
   * @param {number} y the y coordinate of this player
   * @param {number} index index of the player in the linked list
   * @constructor
   * @time O(1)
   */
  constructor(x, y, index) {
    this.x = x;
    this.y = y;
    this.size = 12;
    this.xVel = 0;
    this.yVel = 0;
    this.accel = 2;
    this.decel = 0.1;
    this.maxSpeed = 2;
    this.index = index;
  }

  //using get() in LList only allows you to access attributes, not mutate them

  /**
   * mutator for x attribute
   * @param {number} x new x coordinate
   * @time O(1)
   */
  setX(x) {
    this.x = x;
  }
  /**
   * mutator for y attribute
   * @param {number} y new y coordinate
   * @time O(1)
   */
  setY(y) {
    this.y = y;
  }
  /**
   * mutator for x velocity
   * @param {number} xVel new x velocity
   * @time O(1)
   */
  setxVel(xVel) {
    this.xVel = xVel;
  }
  /**
   * mutator for y velocity
   * @param {number} yVel new y velocity
   * @time O(1)
   */
  setyVel(yVel) {
    this.yVel = yVel;
  }
  /**
   * mutator for speed bounds
   * @param {number} maxSpeed new bounds
   * @time O(1)
   */
  setmaxSpeed(maxSpeed) {
    this.maxSpeed = maxSpeed;
  }
  /**
   * mutator for deceleration
   * @param {number} decel new deceleration
   * @time O(1)
   */
  setDecel(decel) {
    this.decel = decel;
  }

  /**
   * checks if velocities exceed maximum bounds
   * @time O(1)
   */
  checkBounds() {
    if (this.xVel > this.maxSpeed) {
      this.xVel = this.maxSpeed
    } else if (this.xVel < -this.maxSpeed) {
      this.xVel = -this.maxSpeed
    }
    if (this.yVel > this.maxSpeed) {
      this.yVel = this.maxSpeed
    } else if (this.yVel < -this.maxSpeed) {
      this.yVel = -this.maxSpeed
    }
  }
}