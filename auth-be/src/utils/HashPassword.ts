import bcrypt from "bcrypt";

async function generateHashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
}

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const isSame = await bcrypt.compare(password, hashedPassword);
    return isSame;
}

export {
    generateHashPassword,
    comparePassword
}
