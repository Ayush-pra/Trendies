const crypto = require("crypto");
const Idempotency = require("../model/idempotencyModel");

// How long (in ms) before we consider a "processing" lock to be stuck (server crash recovery)
const LOCK_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Generates a SHA-256 hash of the request body.
 * Used to detect if the same idempotency key is sent with a different payload.
 */
const hashPayload = (body) => {
    return crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
};

/**
 * Idempotency Middleware
 * 
 * Prevents duplicate order creation by using a unique key sent from the frontend.
 * 
 * Flow:
 * 1. Extract the Idempotency-Key header
 * 2. Try to insert a new record in the DB (unique index acts as an atomic lock)
 * 3. If insert succeeds → first request, proceed to controller
 * 4. If duplicate key error → check status:
 *    - "completed" → return cached response
 *    - "processing" + recent → return 409 (still processing)
 *    - "processing" + stale → allow retry (server crash recovery)
 */
const idempotencyMiddleware = async (req, res, next) => {
    const idempotencyKey = req.headers["idempotency-key"];

    // If no key is provided, skip idempotency check and proceed normally
    if (!idempotencyKey) {
        return next();
    }

    const bodyHash = hashPayload(req.body);

    try {
        // STEP 1: Attempt to create a new idempotency record
        // The unique index on "key" guarantees only one request can succeed
        await Idempotency.create({
            key: idempotencyKey,
            status: "processing",
            payloadHash: bodyHash,
            startedAt: new Date(),
        });

        // STEP 2: First request — intercept res.json to capture the response
        const originalJson = res.json.bind(res);

        res.json = async (data) => {
            try {
                // Save the response in the idempotency record so future duplicates get this cached response
                await Idempotency.findOneAndUpdate(
                    { key: idempotencyKey },
                    {
                        status: "completed",
                        statusCode: res.statusCode,
                        response: data,
                    }
                );
            } catch (saveError) {
                console.error("Idempotency: Failed to save response:", saveError.message);
            }

            // Send the actual response to the client
            return originalJson(data);
        };

        // Proceed to the actual controller (e.g., PlacedOrder, placeOrderRazorpay)
        return next();

    } catch (error) {
        // STEP 3: Duplicate key error — this key has been seen before
        if (error.code === 11000) {
            const existingRecord = await Idempotency.findOne({ key: idempotencyKey });

            if (!existingRecord) {
                // Extremely rare edge case: record was deleted between insert and find
                return next();
            }

            // CASE A: The original request completed — return the cached response
            if (existingRecord.status === "completed") {
                // Check if the payload has changed (Ghost Cart Bug prevention)
                if (existingRecord.payloadHash !== bodyHash) {
                    return res.status(400).json({
                        message: "This order has already been processed with different items. Please refresh the page and try again.",
                    });
                }

                return res.status(existingRecord.statusCode || 200).json(existingRecord.response);
            }

            // CASE B: The original request is still processing
            if (existingRecord.status === "processing") {
                const elapsed = Date.now() - new Date(existingRecord.startedAt).getTime();

                // If the lock is older than 2 minutes, assume the server crashed — allow retry
                if (elapsed > LOCK_TIMEOUT_MS) {
                    console.warn(`Idempotency: Stale lock detected for key ${idempotencyKey}, allowing retry.`);
                    await Idempotency.deleteOne({ key: idempotencyKey });
                    return next();
                }

                // Lock is recent — the original request is still in progress
                return res.status(409).json({
                    message: "Your order is currently being processed. Please wait.",
                });
            }
        }

        // Unexpected error — don't block the user, proceed without idempotency
        console.error("Idempotency middleware error:", error.message);
        return next();
    }
};

module.exports = idempotencyMiddleware;
