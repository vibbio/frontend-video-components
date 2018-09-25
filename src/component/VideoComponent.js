import React, { Component } from 'react';
import PT from 'prop-types';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';

import Range from './range/Range';
import ReactPlayer from './player/ReactPlayer';
import './styling/index.scss';
import { calculateLength } from './utils';

class VideoComponent extends Component {
    constructor(props) {
        super(props);
        this.load = this.load.bind(this);
        this.onSeekMouseDown = this.onSeekMouseDown.bind(this);
        this.onSeekMouseUp = this.onSeekMouseUp.bind(this);
        this.startLoop = this.startLoop.bind(this);
    }
    state = {
        url: null,
        playing: false,
        volume: 0.8,
        muted: false,
        played: 0,
        prevSeek: [0, 100],
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        ready: false,
        playedWhenStopped: 0
    };
    componentDidMount() {
        this.load(this.props.url, this.props.startTime, this.props.endTime);
    }
    onPlay = () => {
        const { playedWhenStopped, prevSeek, duration } = this.state;
        const playedWhenStoppedMilli = playedWhenStopped * duration * 1000;
        if (prevSeek[0] < playedWhenStoppedMilli && playedWhenStoppedMilli < prevSeek[1]) {
            this.setState({ playing: true, played: playedWhenStopped, seeking: false });
            return;
        }
        this.setState({ playing: true });
    };
    onPause = () => {
        this.setState({ playing: false });
    };
    onSeekMouseDown = () => {
        this.onPause();
        this._seekBackoff = 100;
        const updatedPrevSeek = [
            this.state.prevSeek[0],
            this.state.prevSeek[1]
        ];
        this.setState({ seeking: true, prevSeek: updatedPrevSeek });
    };
    _lastSeek = 0;
    _seekBackoff = 100;
    throttledSeek = (seekToPercent) => {
        const now = Date.now()
        if (now - this._lastSeek < this._seekBackoff) return
        this._lastSeek = now
        setTimeout(() => {
            this.player.seekTo(seekToPercent)
            this.setState({ played: seekToPercent });
        }, 0)
    }
    onSeekChange = ([ seekStart, seekEnd ]) => {
        const { prevSeek } = this.state;
        const [ prevSeekStart, prevSeekEnd ] = prevSeek;

        const updatedPrevSeek = [
            prevSeekStart,
            prevSeekEnd
        ];

        if (seekStart !== prevSeekStart) {
            updatedPrevSeek[0] = seekStart;
            this.throttledSeek(seekStart / (this.state.duration * 1000))
        } else if (seekEnd !== prevSeekEnd) {
            updatedPrevSeek[1] = seekEnd;
            this.throttledSeek(seekEnd / (this.state.duration * 1000))
        }
        
        this.setState({ seeking: true, playing: false, prevSeek: updatedPrevSeek });
    };
    
    onSeekMouseUp = () => this.setState({ seeking: false })

    setVolume = (e) => {
        this.setState({ volume: parseFloat(e.target.value) });
    };

    setPlaybackRate = (e) => {
        this.setState({ playbackRate: parseFloat(e.target.value) });
    };
    startLoop = (loopStart) => {
        this.setState({ played: loopStart });
    };
    isReady = (duration) => {
        if (!this.state.ready) {
            this.setState({ seeking: true });
            const { startTime, endTime } = this.props;
            const prevSeekStart = startTime ? Math.floor(startTime * 1000) : 0;
            const prevSeekEnd = endTime ? Math.floor(endTime * 1000) : duration * 1000;

            const initialPlayed = startTime / (this.state.duration * 1000);

            this.setState({
                ready: true,
                duration,
                prevSeek: [prevSeekStart, prevSeekEnd],
                played: initialPlayed
            });
            if (startTime > 0) {
                this.player.seekTo(startTime);
            }
            this.setState({ seeking: false });
        }
    };
    playPause = () => {
        const { playing, playedWhenStopped, prevSeek, played, duration } = this.state;
        if (playing) {
            this.setState({ playing: false, prevSeek: [...prevSeek], playedWhenStopped: played });
            return;
        }
        const playedWhenStoppedMilli = playedWhenStopped * duration * 1000;
        if (prevSeek[0] < playedWhenStoppedMilli && playedWhenStoppedMilli < prevSeek[1]) {
            this.player.seekTo(playedWhenStopped);
            this.setState({ playing: true, played: playedWhenStopped, seeking: false });
            return;
        }
        const playSeekMarker = prevSeek[0];
        const timeFraction = parseFloat(playSeekMarker);
        const seekTo = timeFraction / (duration * 1000);
        this.player.seekTo(seekTo);
        this.setState({ playing: true, played: seekTo, seeking: false });
    };
    onSeeking = () => {
        if (this.state.stalled) this._seekBackoff += 200;
        if (this._seekTimeout) return;
        this._seekTimeout = setTimeout(this.onSeekingStalled, 2000);
    };
    onResolveStall = () => {
        if (this._seekTimeout) {
            window.clearTimeout(this._seekTimeout);
            delete this._seekTimeout;
        }
        if (this.state.stalled) {
            this._seekBackoff = 100;
            this.setState({ stalled: false })
        }
    };
    onSeekingStalled = () => {
        this.onStalled();
    }
    onStalled = () => {
        this.setState({ stalled: true });
    };
    stop = () => {
        this.setState({ url: null, playing: false });
    };
    toggleMuted = () => {
        this.setState({ muted: !this.state.muted });
    };
    load = (url) => {
        this.setState({
            url,
            loaded: 0
        });
    };
    onProgress = (state) => {
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state);
        }
    };
    onClickFullscreen = () => {
        screenfull.request(findDOMNode(this.player));
    };
    onConfigSubmit = () => {
        let config;
        try {
            config = JSON.parse(this.configInput.value);
        } catch (error) {
            config = {};
            console.error('Error setting config:', error);
        }
        this.setState(config);
    };
    ref = (player) => {
        this.player = player;
    };

    render() {
        const { timeMarkerButtonFunction, cancelFunction, children } = this.props;
        const {
            url, playing, volume, muted, prevSeek, duration, playbackRate,
            played, fileConfig, ready, playedWhenStopped
        } = this.state;

        const maxValue = Math.floor(duration ? duration * 1000 : 10000);

        return (
            <div className="time-marker-modal-content">
                <div className="time-marker-content">
                    <div className="player-wrapper">
                        { url ? (
                            <ReactPlayer
                            ref={this.ref}
                            className={classnames('react-player', { 
                                'stalled': this.state.stalled,
                                'not-ready': !this.state.ready
                            })}
                            width="100%"
                            height="100%"
                            url={url}
                            playing={playing}
                            playbackRate={playbackRate}
                            volume={volume}
                            muted={muted}
                            seeking={this.state.seeking}
                            prevSeek={prevSeek}
                            fileConfig={fileConfig}
                            isReady={this.isReady}
                            startLoop={this.startLoop}
                            onPlay={this.onPlay}
                            onPause={this.onPause}
                            onProgress={this.onProgress}
                            onSeeking={this.onSeeking}
                            onStalled={this.onStalled}
                            onPlaying={this.onResolveStall}
                            onSeeked={this.onResolveStall}
                            onDuration={newDuration => this.setState({ duration: newDuration })} />
                        ) : <div className="player-dummy react-player not-ready" /> }
                        { ready ? (
                            <button className="time-marker-play-button" onClick={this.playPause}>
                                <div className="time-marker-button-content-wrapper">
                                    <div className={classnames('time-marker-button-icon', { 'pause-button': playing || this.state.seeking })}>
                                        {playing || this.state.seeking ?
                                            <i className="material-icons">pause</i> :
                                            <i className="material-icons">play_arrow</i>
                                        }
                                    </div>
                                </div>
                            </button>
                        ) : null }
                    </div>
                    <div className="slider-wrapper">
                        {ready ? (
                            <Range
                                min={0}
                                max={maxValue}
                                defaultValue={[prevSeek[0], prevSeek[1]]}
                                onMouseDown={this.onSeekMouseDown}
                                onChange={this.onSeekChange}
                                onMouseUp={this.onSeekMouseUp}
                                prevSeek={[prevSeek[0], prevSeek[1]]}
                            />
                        ) : (
                            <div className="range-dummy" />
                        )}
                        { ready ? (
                            <div
                                className="played-marker"
                                style={{ left: `${playing ? played * 100 : playedWhenStopped * 100}%` }}
                            />
                        ) : null }
                        <div
                            className="outside-range"
                            style={{ width: `${((prevSeek[0] / 1000) / duration) * 100}%`, left: 0 }}
                        />
                        <div
                            className="outside-range"
                            style={{
                                left: `${((prevSeek[1] / 1000) / duration) * 100}%`,
                                width: `${100 - (((prevSeek[1] / 1000) / duration) * 100)}%`
                            }}
                        />
                        <p className="time-marker-length">{`${calculateLength(prevSeek[0], prevSeek[1])} sec`}</p>
                    </div>
                    {children}
                </div>
                <div className="button-box time-marker-apply-selection-wrapper">
                    <button
                        onClick={cancelFunction}
                        className="button secondary-button time-marker-cancel-selection-button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => timeMarkerButtonFunction(prevSeek, duration)}
                        className="button primary-button time-marker-apply-selection-button"
                    >
                        Apply selection
                    </button>
                </div>
            </div>
        );
    }
}

VideoComponent.propTypes = {
    timeMarkerButtonFunction: PT.func.isRequired,
    cancelFunction: PT.func.isRequired,
    children: PT.node.isRequired,
    url: PT.string,
    startTime: PT.number,
    endTime: PT.number
};

export default VideoComponent;
