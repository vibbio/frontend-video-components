import React from 'react';
import PT from 'prop-types';

const Track = (props) => {
    const { className, included, vertical, offset, length, style } = props;

    const positionStyle = vertical ? {
        bottom: `${offset}%`,
        height: `${length}%`
    } : {
        left: `${offset}%`,
        width: `${length}%`
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
    vertical: PT.bool
};

export default Track;
