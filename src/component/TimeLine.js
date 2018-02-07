import React from 'react';
import PT from 'prop-types';

const TimeLine = ({ startTime, endTime, zoomIn, zoomOut }) => {
    return (
        <div className="TimeLine">
            <div className="time-marker-grid">
                <p>{startTime}</p>
                <div className="grid-line-wrapper">
                    <div className="grid-line" />
                    <span>0</span>
                </div>
                <div className="grid-line-wrapper">
                    <div className="grid-line" />
                    0:22
                </div>
                <div className="grid-line-wrapper">
                    <div className="grid-line" />
                    1:12
                </div>
                <div className="grid-line-wrapper">
                    <div className="grid-line" />
                    1:50
                </div>
                <div className="grid-line-wrapper">
                    <div className="grid-line" />
                    2:55
                </div>
                <p>{endTime}</p>
            </div>

            <div>
                <button onClick={zoomOut}>
                    -
                </button>
                <button onClick={zoomIn}>
                    +
                </button>
            </div>
        </div>
    );
};

TimeLine.propTypes = {};

export default TimeLine;
