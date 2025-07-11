self.onmessage = function (e) {
    const { code, input } = e.data;
    try {
      const wrappedCode = `
        ${code}
        return typeof solution === 'function' ? solution : null;
      `;
  
      const userFunction = new Function(wrappedCode)();
      const result = userFunction(...input); // spread input array
      self.postMessage({ result });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };

   