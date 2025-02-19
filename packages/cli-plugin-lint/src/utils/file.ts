/**
 * @description 文件操作 util
 * @author dashixiong
 */
import { Logger } from "../logger";
import { runPrompts } from "../prompts";
import fs from "fs";
import chalk from "chalk";

/**
 *
 * 检测文件是否存在
 * @param {String} filePath 文件路径
 * @return {fs.Stat | Boolean} 文件信息对象 | false 代表文件不存在
 */
function hasFile(filePath: string) {
  if (filePath) {
    let s;
    try {
      s = fs.statSync(filePath);
    } catch (e) {
      return false;
    }
    return s;
  } else {
    return false;
  }
}

/**
 * check file exist
 * @param {String} filePath 文件路径
 * @param {Boolean} askForOverWrite 是否询问要覆写该文件，如果 询问 且 用户选择覆写，则认为该文件不存在
 * @return {Promise} 返回延迟结果，true 为文件已存在，false 为文件不存在 或 文件已存在但决定覆盖
 */
async function checkExist(
  filePath: string,
  askForOverWrite = false
): Promise<boolean> {
  const fileStat = hasFile(filePath);
  if (fileStat && fileStat.isFile()) {
    if (askForOverWrite) {
      const isOver = await runPrompts({
        type: "confirm",
        message: `${filePath}文件已存在，是否要覆盖(Y/n)?`,
        name: "overWrite",
      });
      return !isOver;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

/**
 * 同步修改文件内容
 * @param {String} filePath 文件路径
 * @param {String} encode 文件读取&写入编码方式 默认utf-8
 * @param {Regexp} pattern 修改部分匹配正则
 * @param {String} replace 被替换的内容
 * @return {Number} 替换结果，1为成功，-1为失败, 0为未发生替换
 */
function syncModifyFile(
  filePath: string,
  pattern: RegExp,
  replace: string,
  encoding: string = "utf8"
) {
  let fileContent;
  try {
    //@ts-ignore
    fileContent = fs.readFileSync(filePath, encoding);
  } catch (err) {
    Logger.info(chalk.red(`read ${filePath} failed`));
    return -1;
  }
  let newFileContent;
  if (fileContent && fileContent.match(pattern)) {
    newFileContent = fileContent.replace(pattern, replace);
  } else {
    return 0;
  }
  try {
    fs.writeFileSync(filePath, newFileContent);
  } catch (err) {
    Logger.info(chalk.red(`modify ${filePath} failed`));
    return -1;
  }
  return 1;
}

export default {
  hasFile,
  checkExist,
  syncModifyFile,
};
