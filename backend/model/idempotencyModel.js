const mongoose = require("mongoose");

const idempotencySchema = new mongoose.Schema({
    // The unique idempotency key sent by the frontend (userId + uuid)
    key: {
        type: String,
        required: true,
        unique: true,
    },
    // Tracks whether the original request is still being processed or has completed
    status: {
        type: String,
        enum: ["processing", "completed"],
        default: "processing",
    },
    // The HTTP status code returned by the original request
    statusCode: {
        type: Number,
    },
    // The full JSON response body returned by the original request (cached for replays)
    response: {
        type: mongoose.Schema.Types.Mixed,
    },
    // Hash of the original request body to detect payload mutations
    payloadHash: {
        type: String,
    },
    // Timestamp when processing started — used to detect "stuck" locks from server crashes
    startedAt: {
        type: Date,
        default: Date.now,
    },
    // TTL: MongoDB will automatically delete this document after 24 hours
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // 24 hours in seconds
    },
});

module.exports = mongoose.model("Idempotency", idempotencySchema);
