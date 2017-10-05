self.addEventListener('message', e => {
    // // Let me just generate some array buffer for the simulation
    // var array_buffer = e.data;
    // // Now to the decoding
    // var decoder = new TextDecoder("utf-8");
    // var view = new DataView(array_buffer, 0, array_buffer.byteLength);
    // var string = decoder.decode(view);
    // var object = JSON.parse(string);
    // self.postMessage(object);

    self.postMessage(e.data);
}, false);
