import React, {Component} from 'react';
import AddVisitor from './add-visitor';


export default class Stream extends Component {
    constructor(props) {
        super(props);
        this.state = {url: ""};
    }

    // Setting up websocket client connection
    componentWillMount() {
        this.ws = new WebSocket("ws://localhost:8888/ws");
        this.ws.onopen = (event) => {
            this.ws.binaryType = "arraybuffer";
            this.ws.onmessage = msg => {
                let bytes = new Uint8Array(msg.data);
                let url = encode(bytes);
                this.setState({url: url});
            }
        };
    }

    componentWillUnmount() {
        this.ws.close();
    }

    makePhotos() {
        this.ws.send("make photo");
    }

    render() {
        return (
            <div>
                <div className="col-md-6">
                    <img id="stream" src={this.state.url} height="300" width="400"/>
                </div>
                <AddVisitor />
                <button onClick={this.makePhotos} className="btn btn-primary">Make photos</button>
            </div>
        );
    }

}

// Converts image bytes from the server and returns image url
function encode(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }

    return "data:image/jpg;base64,"+output;
}