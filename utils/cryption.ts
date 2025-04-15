import Cryptr from "cryptr";

if (!process.env.ENCRYPTION_STRING) {
  throw new Error("ENCRYPTION_STRING is not defined");
}

const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

export default cryption;
