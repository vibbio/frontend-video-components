import React, { Component } from 'react';
import PT from 'prop-types';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';

import ReactPlayer from './player/ReactPlayer';
import './styling/index.scss';

class VideoComponent extends Component {
    constructor(props) {
        super(props);
        this.load = this.load.bind(this);
    }
    state = {
        url: null,
        playing: false,
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

    setPlaybackRate = (e) => {
        this.setState({ playbackRate: parseFloat(e.target.value) });
    };
    isReady = (duration) => {
        if (!this.state.ready) {
            const { startTime, endTime } = this.props;
            const prevSeekStart = startTime ? Math.floor(startTime * 1000) : 0;
            const prevSeekEnd = endTime ? Math.floor(endTime * 1000) : duration * 1000;

            const initialPlayed = this.state.duration ?
                startTime / (this.state.duration * 1000) : 0;

            if (startTime > 0) {
                this.player.seekTo(startTime);
            }

            this.setState({
                ready: true,
                duration,
                prevSeek: [prevSeekStart, prevSeekEnd],
                played: initialPlayed,
                playing: true
            });
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
        const { url, playing, prevSeek, playbackRate, fileConfig } = this.state;
        return (
            <div className="time-marker-modal-content">
                <div className="time-marker-content">
                    <div className="player-wrapper">
                        <ReactPlayer
                            ref={this.ref}
                            className="react-player"
                            width="100%"
                            height="100%"
                            url={url}
                            playing={playing}
                            playbackRate={playbackRate}
                            volume={0.8}
                            muted={false}
                            seeking={this.state.seeking}
                            prevSeek={prevSeek}
                            fileConfig={fileConfig}
                            isReady={this.isReady}
                            onPlay={this.onPlay}
                            onPause={this.onPause}
                            onProgress={this.onProgress}
                            onEnded={this.props.onEndFunction}
                            onDuration={newDuration => this.setState({ duration: newDuration })}
                        />
                        <button className="time-marker-play-button" onClick={this.playPause}>
                            <div className="time-marker-button-content-wrapper">
                                <div className={classnames('time-marker-button-icon', { 'pause-button': playing })}>
                                    {playing ?
                                        <i className="material-icons">pause</i> :
                                        <i className="material-icons">play_arrow</i>
                                    }
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

VideoComponent.propTypes = {
    onEndFunction: PT.func.isRequired,
    url: PT.string.isRequired,
    startTime: PT.number,
    endTime: PT.number
};

export default VideoComponent;
