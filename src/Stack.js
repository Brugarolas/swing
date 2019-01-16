import Sister from 'sister';
import rebound from 'rebound';
import Card from './Card';

/**
 * @param {Object} config Stack configuration.
 * @returns {Object} An instance of Stack object.
 */
const Stack = (config) => {
  let eventEmitter;
  let index;
  let springSystem;
  let stack;

  const construct = () => {
    stack = {};
    springSystem = new rebound.SpringSystem();
    eventEmitter = Sister();
    index = [];
  };

  construct();

  /**
   * Get the configuration object.
   *
   * @returns {Object}
   */
  stack.getConfig = () => {
    return config;
  };

  /**
   * Get a singleton instance of the SpringSystem physics engine.
   *
   * @returns {Sister}
   */
  stack.getSpringSystem = () => {
    return springSystem;
  };

  /**
   * Proxy to the instance of the event emitter.
   *
   * @param {string} eventName
   * @param {string} listener
   * @returns {undefined}
   */
  stack.on = (eventName, listener) => {
    eventEmitter.on(eventName, listener);
  };

  /**
   * Creates an instance of Card and associates it with an element.
   *
   * @param {HTMLElement} element
   * @param {boolean} prepend
   * @returns {Card}
   */
  stack.createCard = (element, prepend) => {
    const card = Card(stack, element, prepend);
    const events = [
      'throwout',
      'throwoutend',
      'throwoutleft',
      'throwoutright',
      'throwoutup',
      'throwoutdown',
      'throwin',
      'throwinend',
      'dragstart',
      'dragmove',
      'dragend'
    ];

    // Proxy Card events to the Stack.
    events.forEach((eventName) => {
      card.on(eventName, (data) => {
        eventEmitter.trigger(eventName, data);
      });
    });

    index.push({
      card,
      element
    });

    return card;
  };

  /**
   * Returns an instance of Card associated with an element.
   *
   * @param {HTMLElement} element
   * @returns {Card|null}
   */
  stack.getCard = (element) => {
    const group = index.find((elem) => {
      return elem === element || elem.element === element;
    });

    if (group) {
      return group.card;
    }

    return null;
  };

  /**
   * Returns al Cards instances in the stack.
   *
   * @returns {Array}
   */
  stack.getCards = () => {
    return [...index];
  };

  /**
   * Remove an instance of Card from the stack index.
   *
   * @param {Card} card
   * @returns {null}
   */
  stack.destroyCard = (card) => {
    const idx = index.findIndex((elem) => {
      return elem === card || elem.card === card;
    });

    index.splice(idx, 1);

    eventEmitter.trigger('destroyCard', card);

    return index;
  };

  /**
  * Remove all instances of Card from the stack index.
  *
  * @returns {null}
  */
  stack.destroyAll = () => {
    index.forEach((element) => {
      eventEmitter.trigger('destroyCard', element.card);
      element.card.unbindListeners();
    });

    index.length = 0;
  };

  return stack;
};

export default Stack;
