import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

import './reset.scss';
import './defaults.scss';
import './App.scss';

import Duration from './Duration';
import VideoComponent from '../component/VideoComponent';

class App extends Component {
    renderLoadButton = (url, label) => (
        <button onClick={() => this.load(url)}>
            {label}
        </button>
    );
    render() {
        return (
            <div className="app">
                <section className="section">
                    <VideoComponent />
                </section>
                { /*
                <section className="section">
                    <table>
                        <tbody>
                            <tr>
                                <th>YouTube</th>
                                <td>
                                    {this.renderLoadButton('https://www.youtube.com/watch?v=oUFJJNQGwhk', 'Test A')}
                                    {this.renderLoadButton('https://www.youtube.com/watch?v=jNgP6d9HraI', 'Test B')}
                                </td>
                            </tr>
                            <tr>
                                <th>Files</th>
                                <td>
                                    {this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', 'mp4')}
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
                        </tbody>
                    </table>
                </section>
                */ }
            </div>
        );
    }
}

export default App;
