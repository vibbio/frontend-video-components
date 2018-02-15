import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';

import Range from './range/Range';
import ReactPlayer from './player/ReactPlayer';
import './styling/VideoComponent.scss';

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
        prevSeek: [0, 0, 100],
        loaded: 0,
        duration: 0,
        playbackRate: 1.0
    };
    componentDidMount() {
        this.load(this.props.url, this.props.startTime, this.props.endTime);
    }
    onPlay = () => {
        this.setState({ playing: true });
    };
    onPause = () => {
        this.setState({ playing: false });
    };
    onSeekMouseDown = () => {
        this.onPause();
        // Start seeking, update how long we have played
        const playedAsSeek = this.state.played * 1000 * this.state.duration;

        const updatedPrevSeek = [
            this.state.prevSeek[0],
            playedAsSeek,
            this.state.prevSeek[2]
        ];
        this.setState({ seeking: true, prevSeek: updatedPrevSeek });
    };
    onSeekChange = (e) => {
        const seekStart = e[0];
        const playSeek = e[1];
        const seekEnd = e[2];

        const playedAsSeek = this.state.played * 1000 * this.state.duration;
        const prevSeek = this.state.prevSeek;

        const prevSeekStart = prevSeek[0];
        const prevSeekPlay = prevSeek[1];
        const prevSeekEnd = prevSeek[2];

        let seekTo = 0;
        const updatedPrevSeek = [
            prevSeekStart,
            prevSeekPlay,
            prevSeekEnd
        ];

        if (seekStart !== prevSeekStart) {
            const timeFraction = parseFloat(seekStart);
            seekTo = timeFraction / (this.state.duration * 1000);
            updatedPrevSeek[1] = playedAsSeek;
            updatedPrevSeek[0] = seekStart;
        } else if (seekEnd !== prevSeekEnd) {
            const timeFraction = parseFloat(seekEnd);
            seekTo = timeFraction / (this.state.duration * 1000);
            updatedPrevSeek[1] = playedAsSeek;
            updatedPrevSeek[2] = seekEnd;
        } else if (playSeek !== prevSeekPlay) {
            const timeFraction = parseFloat(playSeek);
            seekTo = timeFraction / (this.state.duration * 1000);
            updatedPrevSeek[1] = playSeek;
            this.setState({ played: seekTo });
        }
        this.player.seekTo(seekTo);
        this.setState({ seeking: true, prevSeek: updatedPrevSeek });
    };
    onSeekMouseUp = () => {
        const prevSeek = this.state.prevSeek;
        const prevSeekPlay = prevSeek[1];
        const timeFraction = parseFloat(prevSeekPlay);
        const seekTo = timeFraction / (this.state.duration * 1000);
        this.player.seekTo(seekTo);
        this.setState({ seeking: false, playing: false });
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
    playPause = () => {
        if (this.state.playing) {
            const playedAsSeek = this.state.played * 1000 * this.state.duration;

            const prevSeek = [
                this.state.prevSeek[0],
                playedAsSeek,
                this.state.prevSeek[2]
            ];
            this.setState({ playing: false, prevSeek });
            return;
        }
        const playSeekMarker = this.state.prevSeek[1];
        const timeFraction = parseFloat(playSeekMarker);
        const seekTo = timeFraction / (this.state.duration * 1000);
        this.player.seekTo(seekTo);
        this.setState({ playing: true, played: seekTo, seeking: false });
    };
    stop = () => {
        this.setState({ url: null, playing: false });
    };
    toggleMuted = () => {
        this.setState({ muted: !this.state.muted });
    };
    load = (url, startTime, endTime) => {
        const prevSeekStart = startTime ? Math.floor(startTime * 1000) : 0;
        const prevSeekEnd = endTime ? Math.floor(endTime * 1000) : this.state.duration;

        this.setState({
            url,
            played: 0,
            loaded: 0,
            prevSeek: [prevSeekStart, prevSeekStart + 10, prevSeekEnd]
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
        const { timeMarkerButtonFunction } = this.props;
        const {
            url, playing, volume, muted, prevSeek, duration, playbackRate, played, fileConfig
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
                        startLoop={this.startLoop}
                        onPlay={this.onPlay}
                        onPause={this.onPause}
                        onProgress={this.onProgress}
                        onDuration={newDuration => this.setState({ duration: newDuration })}
                    />
                    <div className="play-button-wrapper">
                        <button onClick={this.playPause} className="time-marker-button">
                            {playing ?
                                <i className="material-icons">pause</i> :
                                <i className="material-icons">play_arrow</i>
                            }
                        </button>
                    </div>
                </div>
                <div className="slider-wrapper">
                    {duration && (
                        <Range
                            min={0}
                            max={maxValue}
                            count={2}
                            defaultValue={[prevSeek[0], prevSeek[1] + 100, prevSeek[2]]}
                            pushable
                            playedHandleValue={played ? played * maxValue : prevSeek[1]}
                            allowCross={false}
                            trackStyle={[{ backgroundColor: '#00576F' }, { backgroundColor: '#00849c' }]}
                            handleStyle={[
                                {
                                    height: '20px',
                                    width: '20px',
                                    borderRadius: '20px'
                                },
                                {
                                    marginTop: '-2px'
                                },
                                {
                                    height: '20px',
                                    width: '20px',
                                    borderRadius: '20px'
                                }
                            ]}
                            railStyle={{ backgroundColor: '#a8e5e8' }}
                            onMouseDown={this.onSeekMouseDown}
                            onChange={this.onSeekChange}
                            onMouseUp={this.onSeekMouseUp}
                            prevSeek={prevSeek}
                            playing={playing}
                        />
                    )}
                </div>

                <button
                    onClick={() => timeMarkerButtonFunction(prevSeek)}
                    className="time-marker-modal-content-button"
                >
                    Apply section
                </button>
            </div>
        );
    }
}

export default VideoComponent;
