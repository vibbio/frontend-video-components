import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';

import Range from './range/Range';
import ReactPlayer from '../ReactPlayer';
import './VideoComponent.scss';
import Duration from '../demo/Duration';

class VideoComponent extends Component {
    state = {
        url: null,
        playing: true,
        isPlaying: false,
        volume: 0.8,
        muted: false,
        played: 0,
        playSeek: 0,
        prevSeek: [0, 100],
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: true,
        zoomLevel: 0
    };

    onPlay = () => {
        this.setState({ isPlaying: true });
    };
    onPause = () => {
        this.setState({ isPlaying: false });
    };
    onSeekMouseDown = () => {
        this.setState({ seeking: true, isPlaying: false });
    };
    onSeekChange = (e) => {
        const seekStart = e[0];
        const playSeek = e[1];
        const seekEnd = e[2];

        const prevSeek = this.state.prevSeek;

        const prevSeekStart = prevSeek[0];
        const prevSeekPlay = prevSeek[1];
        const prevSeekEnd = prevSeek[2];

        let seekTo = 0;
        if (seekStart !== prevSeekStart) {
            const timeFraction = parseFloat(seekStart);
            seekTo = timeFraction / (this.state.duration * 1000);
        } else if (seekEnd !== prevSeekEnd) {
            const timeFraction = parseFloat(seekEnd);
            seekTo = timeFraction / (this.state.duration * 1000);
        } else {
            const timeFraction = parseFloat(playSeek);
            seekTo = timeFraction / (this.state.duration * 1000);
        }
        this.setState({ played: seekTo });
        this.player.seekTo(seekTo);
        this.setState({ prevSeek: e, isPlaying: false });
    };
    setVolume = (e) => {
        this.setState({ volume: parseFloat(e.target.value) });
    };
    onSeekMouseUp = (e) => {
        const seekStart = e[0];
        const playSeek = e[1];
        const seekEnd = e[2];

        const prevSeek = this.state.prevSeek;

        const prevSeekStart = prevSeek[0];
        const prevSeekPlay = prevSeek[1];
        const prevSeekEnd = prevSeek[2];

        if (seekStart !== prevSeekStart) {
            this.player.seekTo(parseFloat(seekStart));
        } else if (seekEnd !== prevSeekEnd) {
            this.player.seekTo(parseFloat(seekEnd));
        } else {
            this.player.seekTo(parseFloat(playSeek));
        }

        this.setState({ seeking: false, isPlaying: false }); // , playing: true });
    };
    setPlaybackRate = (e) => {
        this.setState({ playbackRate: parseFloat(e.target.value) });
    };
    playPause = () => {
        if (this.state.isPlaying) {
            this.setState({ isPlaying: false });
            return;
        }
        const playSeekMarker = this.state.prevSeek[1];
        const timeFraction = parseFloat(playSeekMarker);
        const seekTo = timeFraction / (this.state.duration * 1000);
        this.player.seekTo(seekTo);
        this.setState({ isPlaying: true, played: this.state.prevSeek[1] });
    };
    stop = () => {
        this.setState({ url: null, playing: false });
    };
    toggleLoop = () => {
        this.setState({ loop: !this.state.loop });
    };
    toggleMuted = () => {
        this.setState({ muted: !this.state.muted });
    };
    load = (url) => {
        this.setState({
            url,
            played: 0,
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
        const { url, playing, volume, muted, loop, prevSeek, duration, playbackRate, isPlaying, played, fileConfig } = this.state;

        const maxValue = duration ? duration * 1000 : 10000;

        return (
            <div className="time-marker-modal-content">
                <div className="player-wrapper">
                    <ReactPlayer
                        ref={this.ref}
                        className="react-player"
                        width="100%"
                        height="100%"
                        url={url}
                        playing={isPlaying}
                        loop={loop}
                        playbackRate={playbackRate}
                        volume={volume}
                        muted={muted}
                        prevSeek={prevSeek}
                        fileConfig={fileConfig}
                        onPlay={this.onPlay}
                        onPause={this.onPause}
                        onEnded={() => this.setState({ playing: loop })}
                        onProgress={this.onProgress}
                        onDuration={newDuration => this.setState({ duration: newDuration })}
                    />
                    <div className="play-button-wrapper">
                        <button onClick={this.playPause} className="time-marker-button">
                            {isPlaying ?
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
                            defaultValue={[0, 1000, maxValue]}
                            pushable
                            playedHandleValue={played * maxValue}
                            allowCross={false}
                            trackStyle={[{ backgroundColor: '#00576F' }, { backgroundColor: '#00849c' }]}
                            handleStyle={[
                                {
                                    height: '30px',
                                    width: '4px',
                                    borderRadius: '0px',
                                    marginLeft: 0,
                                    marginTop: '-13px'
                                },
                                {
                                    marginTop: '-2px'
                                },
                                {
                                    height: '30px',
                                    width: '4px',
                                    borderRadius: '0px',
                                    marginLeft: '-4px',
                                    marginTop: '-13px'
                                }
                            ]}
                            railStyle={{ backgroundColor: '#a8e5e8' }}
                            onMouseDown={this.onSeekMouseDown}
                            onChange={this.onSeekChange}
                            onMouseUp={this.onSeekMouseUp}
                        />
                    )}
                </div>
                <div className="section">
                    <table>
                        <tbody>
                            <tr>
                                <th>YouTube</th>
                                <td>
                                    <button
                                        onClick={() => this.load('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4')}
                                    >
                                        Test A
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>State</h2>

                    <table>
                        <tbody>
                            <tr>
                                <th>url</th>
                                <td className={!url ? 'faded' : ''}>
                                    {(url instanceof Array ? 'Multiple' : url) || 'null'}
                                </td>
                            </tr>
                            <tr>
                                <th>playing</th>
                                <td>{playing ? 'true' : 'false'}</td>
                            </tr>
                            <tr>
                                <th>prevSeek</th>
                                <td>{`${this.state.prevSeek[0]} : ${this.state.prevSeek[1]} : ${this.state.prevSeek[2]}`}</td>
                            </tr>
                            <tr>
                                <th>duration</th>
                                <td><Duration seconds={duration} /></td>
                            </tr>
                            <tr>
                                <th>elapsed</th>
                                <td><Duration seconds={duration * played} /></td>
                            </tr>
                            <tr>
                                <th>remaining</th>
                                <td><Duration seconds={duration * (1 - played)} /></td>
                            </tr>
                            <tr>
                                <th>played</th>
                                <td>{this.state.played}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default VideoComponent;
