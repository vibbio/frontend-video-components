import React from 'react';
import PT from 'prop-types';

const Track = (props) => {
    const { className, included, vertical, offset, length, style, index } = props;

    const leftPosition = index === 1 ? offset : offset;
    const trackLength = length + 1;

    const positionStyle = vertical ? {
        bottom: `${offset}%`,
        height: `${length}%`
    } : {
        left: `${leftPosition}%`,
        width: `${trackLength}%`
    };

    const elStyle = {
        visibility: included ? 'visible' : 'hidden',
        ...style,
        ...positionStyle
    };
    return <div className={className} style={elStyle} />;
};

Track.propTypes = {
    className: PT.string,
    offset: PT.number,
    length: PT.number,
    style: PT.object,
    included: PT.bool,
    vertical: PT.bool,
    index: PT.number
};

export default Track;
