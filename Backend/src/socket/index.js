// socket.js
let ioInstance;

module.exports = function (io) {
  ioInstance = io; // save io instance globally
  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    socket.on("refetch", async () => {
      // logic to refetch data
    });
  });
};

// export io instance getter
module.exports.getIo = () => ioInstance;
