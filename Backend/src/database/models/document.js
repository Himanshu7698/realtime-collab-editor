const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, default: "" },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        collaborators: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },

                // ROLE -> 0 = owner, 1 = editor, 2 = viewer
                role: {
                    type: String,
                    enum: ["owner", "editor", "viewer"],
                    default: "viewer"
                }
            },
        ],

    },
    { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
