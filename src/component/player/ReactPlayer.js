import React, { Component } from 'react';

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props';
import { getConfig, omit, isObject } from './utils';
import players from './players';
import Player from './Player';
import FilePlayer from './players/FilePlayer';

const SUPPORTED_PROPS = Object.keys(propTypes);

export default class ReactPlayer extends Component {
    static displayName = 'ReactPlayer';
    static propTypes = propTypes;
    static defaultProps = defaultProps;
    static canPlay = (url) => {
        for (const Player of players) {
            if (Player.canPlay(url)) {
                return true;
            }
        }
        return false;
    };
    config = getConfig(this.props, defaultProps, true);

    constructor(props) {
        super(props);
        this.isReady = this.isReady.bind(this);
    }
    componentDidMount() {
        this.progress();
    }

    shouldComponentUpdate(nextProps) {
        for (const key of Object.keys(this.props)) {
            const prop = this.props[key];
            if (!isObject(prop) && prop !== nextProps[key]) {
                return true;
            }
        }
        return false;
    }

    componentWillUnmount() {
        clearTimeout(this.progressTimeout);
    }

    seekTo = (fraction) => {
        if (!this.player) {
            return null;
        }
        return this.player.seekTo(fraction);
    };
    getDuration = () => {
        if (!this.player) return null;
        return this.player.getDuration();
    };
    getCurrentTime = () => {
        if (!this.player) return null;
        return this.player.getCurrentTime();
    };
    getInternalPlayer = (key = 'player') => {
        if (!this.player) return null;
        return this.player[key];
    };
    progress = () => {
        if (this.props.url && this.player && this.player.isReady) {
            const playedSeconds = this.player.getCurrentTime() || 0;
            const loadedSeconds = this.player.getSecondsLoaded();
            const duration = this.player.getDuration();
            if (duration) {
                if (!this.props.seeking) {
                    const progress = {
                        playedSeconds,
                        played: playedSeconds / duration
                    };

                    if (loadedSeconds !== null) {
                        progress.loadedSeconds = loadedSeconds;
                        progress.loaded = loadedSeconds / duration;
                    }
                    // Only call onProgress if values have changed
                    if (progress.played !== this.prevPlayed || progress.loaded !== this.prevLoaded) {
                        this.props.onProgress(progress);
                    }
                    this.prevPlayed = progress.played;
                    this.prevLoaded = progress.loaded;
                }
            }
        }
        this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency);
    };

    isReady = () => {
        const duration = this.player.getDuration();
        this.props.isReady(duration);
    };

    getActivePlayer(url) {
        for (const Player of players) {
            if (Player.canPlay(url)) {
                return Player;
            }
        }
        // Fall back to FilePlayer if nothing else can play the URL
        return FilePlayer;
    }

    wrapperRef = (wrapper) => {
        this.wrapper = wrapper;
    };
    activePlayerRef = (player) => {
        this.player = player;
    };

    renderActivePlayer(url) {
        if (!url) return null;
        const activePlayer = this.getActivePlayer(url);
        return (
            <Player
                {...this.props}
                isReady={this.isReady}
                key={activePlayer.displayName}
                ref={this.activePlayerRef}
                config={this.config}
                activePlayer={activePlayer}
            />
        );
    }

    render() {
        const { url, style, width, height } = this.props;
        const otherProps = omit(this.props, SUPPORTED_PROPS, DEPRECATED_CONFIG_PROPS);
        const activePlayer = this.renderActivePlayer(url);
        return (
            <div ref={this.wrapperRef} style={{ ...style, width, height }} {...otherProps}>
                {[activePlayer]}
            </div>
        );
    }
}
