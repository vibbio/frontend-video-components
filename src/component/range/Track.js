import React from 'react';
import PT from 'prop-types';

const Track = (props) => {
    const { className, offset, length, style } = props;

    const positionStyle = {
        left: `${offset}%`,
        width: `${length}%`
    };

    const elStyle = {
        visibility: 'hidden',
        ...style,
        ...positionStyle
    };
    return <div className={className} style={elStyle} />;
};

Track.propTypes = {
    className: PT.string,
    offset: PT.number,
    length: PT.number,
    style: PT.object
};

export default Track;
