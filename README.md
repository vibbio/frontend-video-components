Time marker
===========

### Usage

The component is exported from VideoComponent. 

**Props**

Prop | Description
---- | -----------
`url` | Contains the url of the video to play
`startTime` | The start time of the video. Undefined if the video does not have a startTime (assumes 0)
`endTime` | The end time of the video. Undefined if hte video does not have a endTime (assumes length of video)
`timeMarkerButtonFunction` | The callback function. Input to the function is [startTime, currentPlayTime, endTime] and length 


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

## Build and publish

Instructions to build and publish the package to VIBBIO npm registry.
Instructions is also found [here](https://docs.google.com/document/d/1m3W3AljdX4-E4U9GkLwl9iUlWsJa0Kj1mxvEjWaQpAk/edit?usp=sharing).

1. Make sure you have access to the npm registry: 
```
npm login -registry=https://registry.npmjs.org/ -scope=@vibbio
```
2. Add the log in details

Username: vibbio

Password: FollowTheNpm123

Email: (this IS public) tech@vibbio.com


3. Update the version in package.json and delete `/styling` in `/lib`

```
npm i
```

4. Commit your new version

5. Publish your new version to npm
```
npm publish
```


### Documentation
The time marker is based on [react-player](https://github.com/CookPete/react-player) and [rc-slider](https://github.com/react-component/slider).
