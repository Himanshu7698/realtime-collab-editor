const Document = require("../database/models/document");
const { createAndUpdateDocumentSchema } = require("../validations");
const mongoose = require('mongoose');

exports.createDocument = async (req, res) => {
    try {
        const { error, value } = createAndUpdateDocumentSchema.validate(req.body);

        if (error) return res.status(400).json({ message: error.details[0].message });

        const { title, content } = value;

        const doc = await Document.create({
            title: title,
            content: content,
            ownerId: req.user.id
        });

        res.status(201).json({ message: "Document created successful.", document: doc });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getMyDocuments = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const search = req.query.search || "";
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const condition = {
            $and: [
                {
                    $or: [
                        { ownerId: userId },
                        { collaborators: { $elemMatch: { userId } } }
                    ]
                },
                search ? { title: { $regex: search, $options: "i" } } : {}
            ]
        };

        const [documents, count] = await Promise.all([
            Document.find(condition)
                .populate("ownerId", "username email")
                .populate("collaborators.userId", "username email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Document.countDocuments(condition)
        ]);

        res.json({
            status: "success",
            info: {
                count,
                current_page: page,
                limit,
                total_page: Math.ceil(count / limit)
            },
            data: documents
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};


exports.viewDocument = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: "Document not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.updateDocument = async (req, res) => {
    try {
        // Validate request body using Joi
        const { error, value } = createAndUpdateDocumentSchema.validate(req.body, { abortEarly: false });

        if (error) return res.status(400).json({ message: error.details[0].message });

        // Proceed with update
        const doc = await Document.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true }
        );

        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Document updated successfully",
            document: doc,
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: err.message,
        });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: "Document deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.addCollaborator = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: "Document not found" });

        const { collaborators } = req.body; // array

        if (!Array.isArray(collaborators) || collaborators.length === 0) {
            return res.status(400).json({ message: "No collaborators provided" });
        }

        for (const collab of collaborators) {
            const { userid, role } = collab;

            if (!userid || !mongoose.Types.ObjectId.isValid(userid)) {
                return res.status(400).json({ message: "Invalid userId" });
            }

            // Prevent duplicates
            if (doc.collaborators.some(c => c.userId?.toString() === userid)) {
                continue; // skip duplicate
            }

            const roleMap = { 0: "owner", 1: "editor", 2: "viewer" };
            doc.collaborators.push({
                userId: new mongoose.Types.ObjectId(userid),
                role: roleMap[role] || "viewer"
            });
        }

        await doc.save();
        res.json({ message: "Collaborators added", doc });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.removeCollaborator = async (req, res) => {
    try {
        const doc = await Document.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { collaborators: { userId: req.body.userId } }
            },
            { new: true }
        );

        res.json({ message: "Collaborator removed", doc });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
