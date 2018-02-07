import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';

import Range from './range/Range';
import ReactPlayer from '../ReactPlayer';
import './VideoComponent.scss';
import Duration from '../demo/Duration';

const zoomOptions = [1, 0.5, 0.25, 0.125];
// zoom: 100%, 50%, 25%, 12.5%

class VideoComponent extends Component {
    state = {
        url: null,
        playing: true,
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
        this.setState({ playing: true });
    };
    onPause = () => {
        this.setState({ playing: false });
    };
    onSeekMouseDown = () => {
        this.setState({ seeking: true, playing: false });
    };
    onSeekChange = (e) => {
        const seekStart = e[0];
        const seekEnd = e[1];
        const prevSeek = this.state.prevSeek;

        const prevSeekStart = prevSeek[0];

        if (seekStart !== prevSeekStart) {
            const timeFraction = parseFloat(seekStart) / 100;
            this.setState({ played: timeFraction });
            this.player.seekTo(parseFloat(timeFraction));
        } else {
            const timeFraction = parseFloat(seekEnd) / 100;
            this.setState({ played: timeFraction });
            this.player.seekTo(parseFloat(timeFraction));
        }
        this.setState({ prevSeek: e, playing: false });
    };
    setVolume = (e) => {
        this.setState({ volume: parseFloat(e.target.value) });
    };
    onSeekMouseUp = (e) => {
        const seekStart = e[0];
        const seekEnd = e[1];
        const prevSeek = this.state.prevSeek;
        const prevSeekStart = prevSeek[0];

        if (seekStart !== prevSeekStart) {
            const timeFraction = parseFloat(seekStart) / 100;
            this.setState({ seeking: false });
            this.player.seekTo(parseFloat(timeFraction));
        } else {
            const timeFraction = parseFloat(seekEnd) / 100;
            this.setState({ seeking: false });
            this.player.seekTo(parseFloat(timeFraction));
        }
    };
    setPlaybackRate = (e) => {
        this.setState({ playbackRate: parseFloat(e.target.value) });
    };
    playPause = () => {
        this.setState({ playing: !this.state.playing });
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

    zoomIn = () => {
        const currentZoom = this.state.zoomLevel;
        if (currentZoom < zoomOptions.length - 1) {
            this.setState({ zoomLevel: currentZoom + 1 });
        }
    };

    zoomOut = () => {
        const currentZoom = this.state.zoomLevel;
        if (currentZoom > 0) {
            this.setState({ zoomLevel: currentZoom - 1 });
        }
    };

    render() {
        const {
            url, playing, volume, muted, loop, duration,
            playbackRate, prevSeek, played,
            vimeoConfig,
            fileConfig
        } = this.state;

        const SLIDER_MIN = 0;
        const SLIDER_MAX = duration;

        // const startTime = this.prettyPrintTimeStamp(((this.state.prevSeek[0] * duration) / SLIDER_MAX) * 1000);
        // const endTime = this.prettyPrintTimeStamp(((this.state.prevSeek[1] * duration) / SLIDER_MAX) * 1000);

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
                        playing={playing}
                        loop={loop}
                        playbackRate={playbackRate}
                        volume={volume}
                        muted={muted}
                        prevSeekStart={parseFloat(prevSeek[0])}
                        prevSeekEnd={parseFloat(prevSeek[1])}
                        vimeoConfig={vimeoConfig}
                        fileConfig={fileConfig}
                        onPlay={this.onPlay}
                        onPause={this.onPause}
                        onEnded={() => this.setState({ playing: loop })}
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
                            defaultValue={[0, 1, maxValue]}
                            pushable
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
                        />
                    )}
                </div>
                <div className="section">
                    <table>
                        <tbody>
                            <tr>
                                <th>YouTube</th>
                                <td>
                                    <button onClick={() => this.load('https://www.youtube.com/watch?v=oUFJJNQGwhk')}>
                                        Test A
                                    </button>
                                    <button onClick={() => this.load('https://www.youtube.com/watch?v=jNgP6d9HraI')}>
                                        Test B
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
                                <td>{`${this.state.prevSeek[0]} : ${this.state.prevSeek[1]}`}</td>
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
