import PropTypes from 'prop-types';

const { string, bool, number, array, oneOfType, shape, object, func } = PropTypes;

export const propTypes = {
    url: oneOfType([string, array]),
    playing: bool,
    controls: bool,
    volume: number,
    muted: bool,
    playbackRate: number,
    prevSeekStart: number,
    prevSeekEnd: number,
    width: oneOfType([string, number]),
    height: oneOfType([string, number]),
    style: object,
    progressFrequency: number,
    playsinline: bool,
    config: shape({
        soundcloud: shape({
            options: object
        }),
        youtube: shape({
            playerVars: object,
            preload: bool
        }),
        facebook: shape({
            appId: string
        }),
        dailymotion: shape({
            params: object,
            preload: bool
        }),
        vimeo: shape({
            iframeParams: object,
            preload: bool
        }),
        vidme: shape({
            format: string
        }),
        file: shape({
            attributes: object,
            tracks: array,
            forceAudio: bool,
            forceHLS: bool,
            forceDASH: bool
        }),
        wistia: shape({
            options: object
        })
    }),
    onReady: func,
    onStart: func,
    onPlay: func,
    onPause: func,
    onBuffer: func,
    onEnded: func,
    onError: func,
    onDuration: func,
    onSeek: func,
    onProgress: func
};

export const defaultProps = {
    playing: false,
    controls: false,
    volume: 0.8,
    muted: false,
    playbackRate: 1,
    width: 640,
    height: 360,
    style: {},
    prevSeekStart: 0,
    prevSeekEnd: 100,
    progressFrequency: 100,
    playsinline: false,
    config: {
        soundcloud: {
            options: {
                visual: true, // Undocumented, but makes player fill container and look better
                buying: false,
                liking: false,
                download: false,
                sharing: false,
                show_comments: false,
                show_playcount: false
            }
        },
        youtube: {
            playerVars: {
                autoplay: 0,
                playsinline: 1,
                showinfo: 0,
                rel: 0,
                iv_load_policy: 3
            },
            preload: false
        },
        facebook: {
            appId: '1309697205772819'
        },
        dailymotion: {
            params: {
                api: 1,
                'endscreen-enable': false
            },
            preload: false
        },
        vimeo: {
            playerOptions: {
                autopause: false,
                autoplay: false,
                byline: false,
                portrait: false,
                title: false
            },
            preload: false
        },
        vidme: {
            format: null
        },
        file: {
            attributes: {},
            tracks: [],
            forceAudio: false,
            forceHLS: false,
            forceDASH: false
        },
        wistia: {
            options: {}
        }
    },
    onReady() {
    },
    onStart() {
    },
    onPlay() {
    },
    onPause() {
    },
    onBuffer() {
    },
    onEnded() {
    },
    onError() {
    },
    onDuration() {
    },
    onSeek() {
    },
    onProgress() {
    }
};

export const DEPRECATED_CONFIG_PROPS = [
    'soundcloudConfig',
    'youtubeConfig',
    'facebookConfig',
    'dailymotionConfig',
    'vimeoConfig',
    'vidmeConfig',
    'fileConfig',
    'wistiaConfig'
];
