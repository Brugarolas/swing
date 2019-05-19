/* eslint-disable max-nested-callbacks */

import raf from 'raf';
import {
  expect
} from 'chai';
import sinon from 'sinon';
import jsdom from 'jsdom';

describe('DOM', () => {
  describe('Stack', () => {
    let Swing;
    let stack;

    beforeEach(() => {
      const dom = new jsdom.JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

      global.window = dom.window;
      global.window.requestAnimationFrame = raf;
      global.document = dom.window.document;
      global.navigator = {};

      // eslint-disable-next-line global-require
      Swing = require('../src').default;
      stack = Swing.Stack();
    });

    describe('.getCard()', () => {
      it('returns card associated with an element', () => {
        const parentElement = global.document.createElement('div');
        const element = global.document.createElement('div');

        parentElement.appendChild(element);

        const card = stack.createCard(element);

        expect(stack.getCard(element)).to.equal(card);
      });
      it('returns null when element is not associated with a card', () => {
        const element = global.document.createElement('div');

        expect(stack.getCard(element)).to.equal(null);
      });
    });
    describe('.destroyCard()', () => {
      it('is called when Card is destroyed', () => {
        const parentElement = global.document.createElement('div');
        const element = global.document.createElement('div');
        const spy = sinon.spy(stack, 'destroyCard');

        parentElement.appendChild(element);

        const card = stack.createCard(element);

        card.destroy();

        expect(spy.calledWith(card)).to.equal(true);
      });
    });

    describe('.getConfig()', () => {
      let setupEnvironment;

      beforeEach(() => {
        setupEnvironment = (config = {}) => {
          const parentElement = global.document.createElement('div');
          const cardElement = global.document.createElement('div');

          config.targetElementWidth = 100;
          config.targetElementHeight = 100;

          stack = Swing.Stack(config);

          parentElement.appendChild(cardElement);

          const card = stack.createCard(cardElement);

          return {
            card,
            cardElement,
            stack
          };
        };
      });
      it('returns the config object', () => {
        const configInput = {};

        stack = Swing.Stack(configInput);

        expect(stack.getConfig()).to.equal(configInput);
      });
      describe('isThrowOut', () => {
        it('is invoked in the event of dragend', () => {
          const spy = sinon.spy();
          const environment = setupEnvironment({
            isThrowOut: spy
          });

          expect(spy.called).to.equal(false);
          environment.card.trigger('mousedown');
          expect(spy.called).to.equal(false);
          environment.card.trigger('panmove', {
            deltaX: 10,
            deltaY: 10
          });
          expect(spy.called).to.equal(false);
          environment.card.trigger('panend', {
            deltaX: 10,
            deltaY: 10
          });
          expect(spy.called).to.equal(true);
        });
        [true, false].forEach((throwOut) => {
          it('determines throwOut event', () => {
            const environment = setupEnvironment({
              allowedDirections: [
                Swing.Direction.UP,
                Swing.Direction.DOWN,
                Swing.Direction.LEFT,
                Swing.Direction.RIGHT
              ],
              isThrowOut: () => {
                return throwOut;
              }
            });
            const spy1 = sinon.spy();
            const spy2 = sinon.spy();

            environment.card.on('throwout', spy1);
            environment.card.on('throwin', spy2);

            environment.card.trigger('mousedown');
            environment.card.trigger('panmove', {
              deltaX: 10,
              deltaY: 10
            });
            environment.card.trigger('panend', {
              deltaX: 10,
              deltaY: 10
            });

            if (throwOut) {
              expect(spy1.called).to.equal(true);
              expect(spy2.called).to.equal(false);
            } else {
              expect(spy1.called).to.equal(false);
              expect(spy2.called).to.equal(true);
            }
          });
        });
      });
      describe('throwOutConfidence', () => {
        it('is invoked in the event of dragmove', (done) => {
          const spy = sinon.spy();
          const environment = setupEnvironment({
            throwOutConfidence: spy
          });

          environment.card.on('throwout', spy);

          environment.card.trigger('panstart');
          environment.card.trigger('panmove', {
            deltaX: 10,
            deltaY: 10
          });

          setTimeout(() => {
            environment.card.trigger('panmove', {
              deltaX: 11,
              deltaY: 10
            });
          }, 10);

          setTimeout(() => {
            environment.card.trigger('panmove', {
              deltaX: 12,
              deltaY: 10
            });
          }, 20);

          // Timeout is required to accommodate requestAnimationFrame.
          setTimeout(() => {
            expect(spy.callCount).to.equal(3);

            done();
          }, 30);
        });
      });
      describe('rotation', () => {
        it('is invoked in the event of dragmove', (done) => {
          const spy = sinon.spy();
          const environment = setupEnvironment({
            rotation: spy
          });

          environment.card.on('rotation', spy);

          environment.card.trigger('panstart');

          setTimeout(() => {
            environment.card.trigger('panmove', {
              deltaX: 10,
              deltaY: 10
            });
          });

          setTimeout(() => {
            environment.card.trigger('panmove', {
              deltaX: 11,
              deltaY: 10
            });
          }, 10);

          setTimeout(() => {
            environment.card.trigger('panmove', {
              deltaX: 12,
              deltaY: 10
            });
          }, 20);

          setTimeout(() => {
            expect(spy.callCount).to.equal(3);

            done();
          }, 40);
        });
      });
      describe('transform', () => {
        it('is invoked in the event of dragmove', (done) => {
          const spy = sinon.spy();
          const environment = setupEnvironment({transform: spy});

          environment.card.on('transform', spy);

          environment.card.trigger('panstart');

          setTimeout(() => {
            environment.card.trigger('panmove', {
              deltaX: 10,
              deltaY: 10
            });
          });

          setTimeout(() => {
            environment.card.trigger('panmove', {
              deltaX: 11,
              deltaY: 10
            });
          }, 10);

          setTimeout(() => {
            environment.card.trigger('panmove', {
              deltaX: 12,
              deltaY: 10
            });
          }, 20);

          setTimeout(() => {
            expect(spy.callCount).to.equal(3);

            done();
          }, 40);
        });
      });
    });
  });
});
