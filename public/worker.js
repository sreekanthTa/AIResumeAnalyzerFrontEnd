class ListNode {
    constructor(val) {
      this.val = val;
      this.next = null;
    }
  }
  
  const convertArrayToLinkedList = (arr) => {
    if (!arr || arr.length === 0) return null;
  
    const head = new ListNode(arr[0]);
    let current = head;
  
    for (let i = 1; i < arr.length; i++) {
      current.next = new ListNode(arr[i]);
      current = current.next;
    }
  
    return head;
  };
  
  const convertLinkedListToArray = (head) => {
    const arr = [];
    const visited = new Set(); // to avoid infinite loops
  
    let current = head;
    while (current && !visited.has(current)) {
      arr.push(current.val);
      visited.add(current);
      current = current.next;
    }
  
    return arr;
  };

  
  self.onmessage = function (e) {
    const { code, input, type = "array", responseType="linkedListToArray" } = e.data;
  
    try {
      const wrappedCode = `
        ${code}
        return typeof solution === 'function' ? solution : null;
      `;
  
      const userFunction = new Function(wrappedCode)();
  
      if (!userFunction) {
        throw new Error("No solution function defined.");
      }
  
      let result;
  
      if (type === "linked_list") {
        const linkedInputs = input.map(arr => convertArrayToLinkedList(arr));
        result = userFunction(...linkedInputs);

        if(responseType=="linkedListToArray"){
            self.postMessage({ result: convertLinkedListToArray(result) }); 
        }

       // Send back array form
      } else if (type === "array" || type === "string") {
        result = userFunction(...input);
        self.postMessage({ result });
      } else {
        throw new Error(`Unsupported input type: ${type}`);
      }
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };
  