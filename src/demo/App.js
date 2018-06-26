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
                        // url="https://storage.googleapis.com/vibbio-storage/COMPRESSED/handelshoyskbi/2017-11-28/MVI_3556.MOV?GoogleAccessId=122546337893-compute@developer.gserviceaccount.com&Expires=1522831379&Signature=Ronzcgwg1B9v9t0Q5pf4PH8bngeRE5G1DqG%2Bt7QAgL9LDsrCN8KcjrwJAe7aG%2BwuNpuRQozAgyBgivl09bdKWLW9S%2FtlxUYgCiYMxOi6OWdGXl2K%2Be5LiL6XwUxNN52yYZRrN4KY6WsCbsn6nzXgBmbE1ddtcH8yFlTrmKhc4cV527X0EukiHgfE3hzy0hNVo1%2BKL8grUBWHva%2FEWGRQodXT%2FlsvHx2VvY73JN64Tr5oq9PT52SIRLp1wQZW85Gaxp%2Bm6K56E2ye%2BenG59mlNWSXy%2FpeSyedBPDOYXr9iQxeKBaPgAzfHozliw0DuzbWtnVqONOnw17RNyuzMwvkVA%3D%3D"
                        url="https://storage.googleapis.com/dev-vibbex-bucket/coolturtle/2018-05-07/85bbeb7c-54d4-4606-b2d3-848882c5ba70.mp4"
                        imageUrl="https://storage.googleapis.com/dev-vibbex-bucket/IMAGE_STRIPS/coolturtle/2018-05-07/85bbeb7c-54d4-4606-b2d3-848882c5ba70.mp4.jpg"
                        // imageUrl="https://storage.googleapis.com/vibbio/imagestrip_placeholder.png"
                        // startTime={23.2323}
                        endTime={undefined}
                        timeMarkerButtonFunction={func}
                    >
                        <p>Add children components here</p>
                    </VideoComponent>
                </section>
            </div>
        );
    }
}

export default App;
