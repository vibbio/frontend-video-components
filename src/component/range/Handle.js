import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { prettyPrintTimeStamp } from '../utils';

class Handle extends Component {
    focus() {
        this.handle.focus();
    }

    blur() {
        this.handle.blur();
    }

    render() {
        const {
            index, className, offset, style, disabled, min, max, value, ...restProps
        } = this.props;

        const positionStyle = { left: `${offset}%` };
        const elStyle = {
            ...style
        };
        let ariaProps = {};
        if (value !== undefined) {
            ariaProps = {
                ...ariaProps,
                'aria-valuemin': min,
                'aria-valuemax': max,
                'aria-valuenow': value,
                'aria-disabled': !!disabled
            };
        }

        return (
            <div className={classnames('handle-wrapper', `handle-${index}`)} style={positionStyle}>
                <div
                    ref={node => (this.handle = node)}
                    role="slider"
                    tabIndex="0"
                    {...ariaProps}
                    {...restProps}
                    className={className}
                    style={elStyle}
                />
                <div className="handle-value">
                    <span>{prettyPrintTimeStamp(value)}</span>
                </div>
            </div>
        );
    }
}

Handle.propTypes = {
    index: PropTypes.number,
    className: PropTypes.string,
    dragging: PropTypes.bool,
    offset: PropTypes.number,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number
};

export default Handle;
