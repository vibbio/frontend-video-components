import React from 'react';
import PropTypes from 'prop-types';
import {prettyPrintTimeStamp} from "../utils";

export default class Handle extends React.Component {
    focus() {
        this.handle.focus();
    }

    blur() {
        this.handle.blur();
    }

    render() {
        const {
            index, className, vertical, offset, style, disabled, dragging, min, max, value, ...restProps
        } = this.props;

        const postionStyle = vertical ? { bottom: `${offset}%` } : { left: `${offset}%` };
        const elStyle = {
            ...style,
            ...postionStyle,
        };
        let ariaProps = {};
        if (value !== undefined) {
            ariaProps = {
                ...ariaProps,
                'aria-valuemin': min,
                'aria-valuemax': max,
                'aria-valuenow': value,
                'aria-disabled': !!disabled,
            };
        }

        return (
            <div
                ref={node => (this.handle = node)}
                role="slider"
                tabIndex="0"
                {...ariaProps}
                {...restProps}
                className={className}
                style={elStyle}
            >
                {((index !== 1) || dragging) && (
                    <div className="handle-value">
                        <span>{prettyPrintTimeStamp(value)}</span>
                    </div>
                )}
            </div>
        );
    }
}

Handle.propTypes = {
    className: PropTypes.string,
    vertical: PropTypes.bool,
    offset: PropTypes.number,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
};
