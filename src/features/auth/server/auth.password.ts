import { hash, verify, argon2id } from "argon2";

/** Produces a salted password hash suitable for credential storage. */
export function hashPassword(password: string) {
    return hash(password, { type: argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
}

/** Verifies a password against its stored hash. */
export async function verifyPassword(passwordHash: string, password: string) {
    try {
        return await verify(passwordHash, password);
    } catch {
        return false;
    }
}
