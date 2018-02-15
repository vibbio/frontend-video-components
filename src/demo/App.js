import React, { Component } from 'react';

import './reset.scss';
import './defaults.scss';
import './App.scss';

import VideoComponent from '../component/VideoComponent';

class App extends Component {
    render() {
        return (
            <div className="app">
                <section className="section">
                    <VideoComponent
                        url={'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'}
                    />
                </section>
            </div>
        );
    }
}

export default App;
