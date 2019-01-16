/**
 * Return direct children elements.
 *
 * @see http://stackoverflow.com/a/27102446/368691
 * @param {HTMLElement} element
 * @returns {Array}
 */
const elementChildren = (element) => {
  const childs = Array.from(element.childNodes);

  return childs.filter((child) => {
    return child.nodeType === 1;
  });
};

const touchDevide = 'ontouchstart' in window ||
  window.DocumentTouch && document instanceof window.DocumentTouch ||
  navigator.maxTouchPoints || navigator.msMaxTouchPoints;

/**
 * @see http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
 * @returns {boolean}
 */
const isTouchDevice = () => {
  return touchDevide;
};

export {
  elementChildren,
  isTouchDevice
};
