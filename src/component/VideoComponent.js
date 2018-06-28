import React, { Component } from 'react';
import PT from 'prop-types';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';

import Range from './range/Range';
import ReactPlayer from './player/ReactPlayer';
import './styling/index.scss';

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
        const updatedPrevSeek = [
            this.state.prevSeek[0],
            this.state.prevSeek[1]
        ];
        this.setState({ seeking: true, prevSeek: updatedPrevSeek });
    };
    onSeekChange = (e) => {
        const seekStart = e[0];
        const seekEnd = e[1];

        const { prevSeek } = this.state;
        const prevSeekStart = prevSeek[0];
        const prevSeekEnd = prevSeek[1];

        const updatedPrevSeek = [
            prevSeekStart,
            prevSeekEnd
        ];

        if (seekStart !== prevSeekStart) {
            updatedPrevSeek[0] = seekStart;
        } else if (seekEnd !== prevSeekEnd) {
            updatedPrevSeek[1] = seekEnd;
        }
        this.setState({ seeking: true, prevSeek: updatedPrevSeek });
    };
    onSeekMouseUp = () => {
        const { prevSeek, duration, played } = this.state;
        const prevSeekStart = prevSeek[0];
        const prevSeekEnd = prevSeek[1];
        const timeFractionStart = parseFloat(prevSeekStart);
        const seekToStart = timeFractionStart / (duration * 1000);

        const timeFractionEnd = parseFloat(prevSeekEnd);
        const seekToEnd = timeFractionEnd / (duration * 1000);

        const startDiff = Math.abs(played - seekToStart);
        const endDiff = Math.abs(played - seekToEnd);
        if (endDiff > startDiff) {
            this.player.seekTo(seekToEnd);
            this.setState({ seeking: false, playing: false, played: seekToEnd });
            return;
        }

        this.player.seekTo(seekToStart);
        this.setState({ seeking: false, playing: false, played: seekToStart });

    };

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
        const { imageUrl, timeMarkerButtonFunction, children } = this.props;
        const {
            url, playing, volume, muted, prevSeek, duration, playbackRate,
            played, fileConfig, ready, playedWhenStopped
        } = this.state;

        const maxValue = Math.floor(duration ? duration * 1000 : 10000);

        return (
            <div className="time-marker-modal-content">
                <div className="player-wrapper">
                    <ReactPlayer
                        ref={this.ref}
                        className="react-player"
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
                        onDuration={newDuration => this.setState({ duration: newDuration })}
                    />
                    <button className="play-button-wrapper" onClick={this.playPause}>
                        <div className="time-marker-button-wrapper">
                            <div className={classnames('time-marker-button', { 'pause-button': playing })}>
                                {playing ?
                                    <i className="material-icons">pause</i> :
                                    <i className="material-icons">play_arrow</i>
                                }
                            </div>
                        </div>
                    </button>
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
                    ) : <noscript />}
                    <img src={imageUrl} role="presentation" className="image-strip" />
                    <div
                        className="played-marker"
                        style={{ left: `${playing ? played * 100 : playedWhenStopped * 100}%` }}
                    />
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
                </div>
                {children}
                <button
                    onClick={() => timeMarkerButtonFunction(prevSeek, duration)}
                    className="button primary-button time-marker-modal-content-button"
                >
                    Apply selection
                </button>
            </div>
        );
    }
}

VideoComponent.propTypes = {
    timeMarkerButtonFunction: PT.func.isRequired,
    children: PT.node.isRequired,
    imageUrl: PT.string.isRequired,
    url: PT.string.isRequired,
    startTime: PT.number,
    endTime: PT.number
};

export default VideoComponent;
