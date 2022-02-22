export type Upload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => unknown;
};
