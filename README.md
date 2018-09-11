Slideshow player
===========

### Usage

Play the file on the url from start to end and call onEndFunction when it has reached the end.

The component is exported from VideoComponent. 

**Props**

Prop | Description
---- | -----------
`url` | Contains the url of the video to play
`startTime` | The start time of the video. Undefined if the video does not have a startTime (assumes 0)
`endTime` | The end time of the video. Undefined if hte video does not have a endTime (assumes length of video)
`onEndFunction` | The function is called when the selected time span is played


## Run local
 
```
npm i && npm start
```

The demo of the time marker is found in `react-player/src/demo/App.js`. 
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

### Documentation
The time marker is based on [react-player](https://github.com/CookPete/react-player) and [rc-slider](https://github.com/react-component/slider).
