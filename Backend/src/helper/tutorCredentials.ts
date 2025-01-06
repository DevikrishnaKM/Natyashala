import { v4 as uuidv4 } from "uuid";

export const createTutorId = (name: string) => {
  try {
    const baseId = `${name}`;

    let uniqueSuffix = uuidv4().split("-")[0];

    uniqueSuffix.toUpperCase();

    return `${baseId}-${uniqueSuffix}`;
  } catch (error: any) {
    console.log("error in creating tutor id", error);
  }
};

export const createUniquePass = (length: number) => {
  try {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  } catch (err: any) {
    console.log("error in creating unique pass in tutor credentials");
  }
};
