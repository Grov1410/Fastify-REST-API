import crypto from "crypto";
export function hashPassword(password: string){
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return { hash, salt };
};

export function verifyPassword({candidatPassword, salt, hash}: {candidatPassword: string; salt: string; hash: string;}){
    const candidatHash = crypto
        .pbkdf2Sync(candidatPassword, salt, 1000, 64, "sha512")
        .toString("hex");
    return candidatHash === hash;
}