import React from 'react';
import PropTypes from 'prop-types';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import classnames from 'classnames';
import warning from 'warning';
import Handle from './Handle';
import * as utils from './utils';

function noop() {}

export default function createSlider(Component) {
    return class ComponentEnhancer extends Component {
        static displayName = `ComponentEnhancer(${Component.displayName})`;
        static propTypes = {
            ...Component.propTypes,
            min: PropTypes.number,
            max: PropTypes.number,
            className: PropTypes.string,
            prefixCls: PropTypes.string,
            children: PropTypes.any,
            onBeforeChange: PropTypes.func,
            onChange: PropTypes.func,
            onAfterChange: PropTypes.func,
            handle: PropTypes.func,
            style: PropTypes.object,
            minimumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
            maximumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
            handleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
            trackStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
            railStyle: PropTypes.object,
            autoFocus: PropTypes.bool,
            onFocus: PropTypes.func,
            onBlur: PropTypes.func
        };

        static defaultProps = {
            ...Component.defaultProps,
            prefixCls: 'rc-slider',
            className: '',
            min: 0,
            max: 100,
            step: 1,
            marks: {},
            handle({ index, ...restProps }) {
                return <Handle index={index} {...restProps} key={index} />;
            },
            onBeforeChange: noop,
            onChange: noop,
            onAfterChange: noop,
            included: true,
            trackStyle: [{}],
            handleStyle: [{}],
            railStyle: {}
        };

        constructor(props) {
            super(props);

            if (process.env.NODE_ENV !== 'production') {
                const { step, max, min } = props;
                warning(
                    step && Math.floor(step) === step ? (max - min) % step === 0 : true,
                    'Slider[max] - Slider[min] (%s) should be a multiple of Slider[step] (%s)',
                    max - min,
                    step
                );
            }
            this.handlesRefs = {};
        }

        componentWillUnmount() {
            if (super.componentWillUnmount) super.componentWillUnmount();
            this.removeDocumentEvents();
        }

        componentDidMount() {
            // Snapshot testing cannot handle refs, so be sure to null-check this.
            this.document = this.sliderRef && this.sliderRef.ownerDocument;
        }

        onMouseDown = (e) => {
            if (e.button !== 0) { return; }

            let position = utils.getMousePosition(e);
            if (!utils.isEventFromHandle(e, this.handlesRefs)) {
                this.dragOffset = 0;
            } else {
                const handlePosition = utils.getHandleCenterPosition(e.target);
                this.dragOffset = position - handlePosition;
                position = handlePosition;
            }
            this.removeDocumentEvents();
            this.onMouseDownClick();
            this.onStart(position);
            this.addDocumentMouseEvents();
            utils.pauseEvent(e);
        }

        onTouchStart = (e) => {
            if (utils.isNotTouchEvent(e)) return;

            let position = utils.getTouchPosition(e);
            if (!utils.isEventFromHandle(e, this.handlesRefs)) {
                this.dragOffset = 0;
            } else {
                const handlePosition = utils.getHandleCenterPosition(e.target);
                this.dragOffset = position - handlePosition;
                position = handlePosition;
            }
            this.onStart(position);
            this.addDocumentTouchEvents();
            utils.pauseEvent(e);
        }

        onFocus = (e) => {
            const { onFocus } = this.props;
            if (utils.isEventFromHandle(e, this.handlesRefs)) {
                const handlePosition = utils.getHandleCenterPosition(e.target);
                this.dragOffset = 0;
                this.onStart(handlePosition);
                utils.pauseEvent(e);
                if (onFocus) {
                    onFocus(e);
                }
            }
        }

        onBlur = (e) => {
            const { onBlur } = this.props;
            this.onEnd(e);
            if (onBlur) {
                onBlur(e);
            }
        };

        addDocumentTouchEvents() {
            // just work for Chrome iOS Safari and Android Browser
            this.onTouchMoveListener = addEventListener(this.document, 'touchmove', this.onTouchMove);
            this.onTouchUpListener = addEventListener(this.document, 'touchend', this.onEnd);
        }

        addDocumentMouseEvents() {
            this.onMouseMoveListener = addEventListener(this.document, 'mousemove', this.onMouseMove);
            this.onMouseUpListener = addEventListener(this.document, 'mouseup', this.onEnd);
        }

        removeDocumentEvents() {
            /* eslint-disable no-unused-expressions */
            this.onTouchMoveListener && this.onTouchMoveListener.remove();
            this.onTouchUpListener && this.onTouchUpListener.remove();

            this.onMouseMoveListener && this.onMouseMoveListener.remove();
            this.onMouseUpListener && this.onMouseUpListener.remove();
            /* eslint-enable no-unused-expressions */
        }

        onMouseUp = () => {
            this.onEnd();
            this.onMouseUpClick();
            this.removeDocumentEvents();
        }

        onMouseMove = (e) => {
            if (!this.sliderRef) {
                this.onEnd();
                return;
            }
            const position = utils.getMousePosition(e);
            this.onMove(e, position - this.dragOffset);
        }

        onTouchMove = (e) => {
            if (utils.isNotTouchEvent(e) || !this.sliderRef) {
                this.onEnd();
                return;
            }

            const position = utils.getTouchPosition(e);
            this.onMove(e, position - this.dragOffset);
        }

        onKeyDown = (e) => {
            if (this.sliderRef && utils.isEventFromHandle(e, this.handlesRefs)) {
                this.onKeyboard(e);
            }
        }

        focus() {
            this.handlesRefs[0].focus();
        }

        blur() {
            this.handlesRefs[0].blur();
        }

        getSliderStart() {
            const slider = this.sliderRef;
            const rect = slider.getBoundingClientRect();

            return rect.left;
        }

        getSliderLength() {
            const slider = this.sliderRef;
            if (!slider) {
                return 0;
            }

            const coords = slider.getBoundingClientRect();
            return coords.width;
        }

        calcValue(offset) {
            const { min, max } = this.props;
            const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
            const value = (ratio * (max - min)) + min;
            return value;
        }

        calcValueByPos(position) {
            const pixelOffset = position - this.getSliderStart();
            const nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
            return nextValue;
        }

        calcOffset(value) {
            const { min, max } = this.props;
            const ratio = (value - min) / (max - min);
            return ratio * 100;
        }

        saveSlider = (slider) => {
            this.sliderRef = slider;
        }

        saveHandle(index, handle) {
            this.handlesRefs[index] = handle;
        }

        render() {
            const {
                prefixCls,
                className,
                children,
                maximumTrackStyle,
                style,
                railStyle
            } = this.props;
            const { tracks, handles } = super.render();

            const sliderClassName = classnames(prefixCls, {
                [className]: className
            });
            return (
                <div
                    ref={this.saveSlider}
                    className={sliderClassName}
                    onTouchStart={this.onTouchStart}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    onKeyDown={this.onKeyDown}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    style={style}
                >
                    <div
                        className={`${prefixCls}-rail`}
                        style={{
                            ...maximumTrackStyle,
                            ...railStyle
                        }}
                    />
                    {tracks}
                    {handles}
                    {children}
                </div>
            );
        }
    };
}
