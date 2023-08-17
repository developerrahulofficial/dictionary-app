/**
 * ElementFactory - fluent element factory
 *
 * Usage:
 *
 * const el = new ElementFactory('div');
 * el.text('foo').class('green').attribute('data-foo');
 */
class ElementFactory {
  constructor(tag) {
    this.el = document.createElement(tag);
  }
  text(val) {
    this.el.appendChild(document.createTextNode(val));
    return this;
  }
  class(val) {
    this.el.classList.add(val);
    return this;
  }
  attribute(key, val) {
    this.el.setAttribute(key, val);
    return this;
  }
  addTo(parent) {
    parent.appendChild(this.el);
    return this.el;
  }
  insertBefore(parent, ref) {
    parent.insertBefore(this.el, ref);
    return this.el;
  }
}

const element = (tag) => {
  return new ElementFactory(tag);
};

export default element;
