"use strict";
'use server';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = verifySignature;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Verifies the signature of the incoming webhook request.
 * This function is designed to work with Next.js API Routes or Server Actions.
 * @param {Buffer} payload - The raw body buffer of the request.
 * @param {string} signature - The signature header from the webhook request.
 * @param {string} secretKey - Your Chargily API secret key.
 * @returns {boolean} - Returns true if the signature is valid, false otherwise.
 */
function verifySignature(payload, signature, secretKey) {
    if (!signature) {
        return false;
    }
    const sigPrefix = ''; // Define if there's a specific prefix used
    const sigHashAlg = 'sha256'; // Define the hashing algorithm
    const computedSignature = crypto_1.default
        .createHmac(sigHashAlg, secretKey)
        .update(payload)
        .digest('hex');
    const digest = Buffer.from(sigPrefix + computedSignature, 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');
    if (signatureBuffer.length !== digest.length ||
        !crypto_1.default.timingSafeEqual(digest, signatureBuffer)) {
        throw new Error('The signature is invalid.');
    }
    console.log('The signature is valid');
    return true;
}
//# sourceMappingURL=index.js.map