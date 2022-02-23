import { ReadStream } from "fs-capacitor";

export type Upload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
};
