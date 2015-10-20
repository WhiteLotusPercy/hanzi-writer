import StrokeMatcher from './StrokeMatcher';
import UserStroke from './models/UserStroke';
import UserStrokeRenderer from './renderers/UserStrokeRenderer';
import {inArray} from './utils';

class Quiz {
  // TODO: too many dependencies... do something about this
  constructor({canvas, animator, character, characterRenderer, hintRenderer, highlightRenderer, quizOptions, userStrokeOptions}) {
    this._canvas = canvas;
    this._animator = animator;
    this._character = character;
    this._characterRenderer = characterRenderer;
    this._hintRenderer = hintRenderer;
    this._highlightRenderer = highlightRenderer;
    this._quizOptions = quizOptions;
    this._userStrokeOptions = userStrokeOptions;

    this._currentStrokeIndex = 0;
    this._numRecentMistakes = 0;
    this._totalMistakes = 0;
    this._drawnStrokes = [];
    this._isActive = true;
    this._strokeMatcher = new StrokeMatcher();

    this._setupCharacter();
  }

  startUserStroke(point) {
    if (!this._isActive) return null;
    if (this._userStroke) return this.endUserStroke();
    this._userStroke = new UserStroke(point);
    this._userStrokeRenderer = new UserStrokeRenderer(this._userStroke, this._userStrokeOptions);
    this._userStrokeRenderer.setCanvas(this._canvas).draw();
  }

  continueUserStroke(point) {
    if (!this._userStroke) return;
    this._userStroke.appendPoint(point);
    this._userStrokeRenderer.updatePath();
  }

  endUserStroke() {
    if (!this._userStroke) return Promise.resolve();

    this._animator.animate((animation) => {
      const promises = [];
      const matchingStroke = this._strokeMatcher.getMatchingStroke(this._userStroke, this._character.getStrokes());
      promises.push(this._userStrokeRenderer.fadeAndRemove(animation));
      this._userStroke = null;
      this._userStrokeRenderer = null;
      if (!this._isActive) return Promise.resolve();

      if (this._isValidStroke(matchingStroke)) {
        this._handleSuccess();
        this._drawMatchingStroke(matchingStroke, animation);
      } else {
        this._handleFaiulure();
        if (this._numRecentMistakes > 2) {
          promises.push(this._highlightCorrectStroke(animation));
        }
      }
      return Promise.all(promises);
    });
  }

  cancel() {
    this._isActive = false;
  }

  _handleSuccess() {
    this._currentStrokeIndex += 1;
    this._numRecentMistakes = 0;
    if (this._currentStrokeIndex === this._character.getNumStrokes()) this.isQuizzing = false;
  }

  _handleFaiulure() {
    this._numRecentMistakes += 1;
    this._totalMistakes += 1;
  }

  _highlightCorrectStroke(animation) {
    const strokeHintRenderer = this._highlightRenderer.getStrokeRenderer(this._currentStrokeIndex);
    return strokeHintRenderer.highlight(animation);
  }

  _drawMatchingStroke(stroke, animation) {
    this._drawnStrokes.push(stroke);
    this._characterRenderer.showStroke(stroke.getStrokeNum(), animation);
  }

  _isValidStroke(stroke) {
    if (!stroke) return false;
    if (inArray(stroke, this._drawnStrokes)) return false;
    return stroke === this._character.getStroke(this._currentStrokeIndex);
  }

  // hide the caracter, show hint if needed
  _setupCharacter() {
    this._animator.animate((animation) => {
      const hintAction = this._quizOptions.showHint ? 'show' : 'hide';
      return Promise.all([
        this._characterRenderer.hide(animation),
        this._hintRenderer[hintAction](animation),
      ]);
    });
  }
}

export default Quiz;
