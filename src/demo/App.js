import React, { Component } from 'react';

import './reset.scss';
import './defaults.scss';
import './App.scss';

import VideoComponent from '../component/VideoComponent';

class App extends Component {
    render() {
        const func = values => console.log('submitted values: ', values);
        return (
            <div className="app">
                <section className="section">
                    <VideoComponent
                        url={'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'}
                        startTime={23.2323}
                        endTime={46.343434}
                        timeMarkerButtonFunction={func}
                    />
                </section>
            </div>
        );
    }
}

export default App;
