import { readdirSync, statSync } from "fs";
import { join } from "path";

const readDirRecursive = async (
  currentPath: string,
  callback: (path: string) => void
) => {
  for (const file of readdirSync(currentPath)) {
    const absoluteFilePath = join(currentPath, file);
    if (statSync(absoluteFilePath).isDirectory()) {
      await readDirRecursive(absoluteFilePath, callback);
    } else {
      await callback(absoluteFilePath);
    }
  }
};

export default readDirRecursive;
