/**
 * Verifies the signature of the incoming webhook request.
 * This function is designed to work with Next.js API Routes or Server Actions.
 * @param {Buffer} payload - The raw body buffer of the request.
 * @param {string} signature - The signature header from the webhook request.
 * @param {string} secretKey - Your Chargily API secret key.
 * @returns {boolean} - Returns true if the signature is valid, false otherwise.
 */
export declare function verifySignature(payload: Buffer, signature: string, secretKey: string): boolean;
//# sourceMappingURL=index.d.ts.map