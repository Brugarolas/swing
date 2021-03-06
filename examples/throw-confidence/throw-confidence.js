document.addEventListener('DOMContentLoaded', function () {
    var stack,
        cardElement,
        throwOutConfidenceBind,
        directionBind,
        throwOutConfidenceElements;

    stack = window.swing.Stack();
    cardElement = document.querySelector('.stack li');
    throwOutConfidenceBind = document.querySelector('#throw-out-confidence-bind');
    directionBind = document.querySelector('#direction-bind');
    throwOutConfidenceElements = {};

    window.card = stack.createCard(cardElement);

    stack.on('dragstart', function (e) {
        throwOutConfidenceElements.yes = e.target.querySelector('.yes').style;
        throwOutConfidenceElements.no = e.target.querySelector('.no').style;
    });

    stack.on('dragmove', function (e) {
        throwOutConfidenceElements[e.throwDirection == window.swing.Direction.RIGHT ? 'yes' : 'no'].opacity = e.throwOutConfidence;

        throwOutConfidenceBind.innerHTML = e.throwOutConfidence.toFixed(3);
        directionBind.innerHTML = e.throwDirection.toString();
    });

    stack.on('dragend', function (e) {
        if (e.throwOutConfidence != 1) {
            throwOutConfidenceElements.yes.opacity = 0;
            throwOutConfidenceElements.no.opacity = 0;
        }
    });
});
