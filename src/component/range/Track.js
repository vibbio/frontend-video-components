/* eslint-disable react/prop-types */
import React from 'react';

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

export default Track;
