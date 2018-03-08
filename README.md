Video player
===========

### Usage

The component is exported from VideoComponent. 

*Installation*

```
npm i --save @vibbio/react-player
```

Add the player: 
```

import ReactPlayer from '@vibbio/react-player';
...

<ReactPlayer
    width="100%"
    height="100%"
    url={src}
    playing
    controls
/>
```

*Props*

Prop | Description
---- | -----------
`url` | Contains the url of the video to play

*Run local* 
```
npm i && npm start
```

The demo of the time marker is found in `frontend-video-components/src/demo/App.js`. 
It could be smart to add some state information to the VideoComponent when working on it:

```
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
    </tbody>
</table>
```

*Build*

Build publish, but make sure you have access to vibbio npm registry. 

```
npm i
npm version patch
npm run build
npm publish
```

### Documentation

The time marker is based on [react-player](https://github.com/CookPete/react-player)
