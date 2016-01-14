
let callbacks = [];

export const onUnload = (callback) => {
  callbacks.push(callback);
};

window.onunload = function(e) {
  callbacks.forEach((callback) => callback(e));
};
