function documentSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_document", ({ documentId, userId }) => {
      socket.join(documentId);
      socket.to(documentId).emit("user_joined", { userId });
    });

    socket.on("edit_document", ({ documentId, content }) => {
      socket.to(documentId).emit("document_updated", { content });
    });

    socket.on("leave_document", ({ documentId, userId }) => {
      socket.leave(documentId);
      socket.to(documentId).emit("user_left", { userId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = documentSocket;
