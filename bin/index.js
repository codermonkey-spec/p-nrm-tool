#!/usr/bin/env node
const { exec } = require("node:child_process");
const { name, version } = require("../package.json");
const { fileToObject, objectToFile } = require("./utils");

const argv = process.argv;

const { data } = fileToObject("./data.json");

// -v
const version_option = () => {
  console.log(`${name} v${version}`);
};

// ls
const list_option = () => {
  exec("npm config get registry", (error, stdout, stderr) => {
    let str = "";
    if (error) {
      console.log(`exec error:${error}`);
      return;
    }

    data.forEach((item) => {
      const [key, value] = Object.entries(item)[0];

      if (value.trim() === stdout.trim()) {
        str += "*";
      } else {
        str = "";
      }

      console.log(`${str} ${" ".repeat(1 - str.length)}${key} => ${value}`);
    });
  });
};

// add
const add_option = () => {
  const option_name = "add";
  const key = argv[argv.indexOf(option_name) + 1];
  const value = argv[argv.indexOf(option_name) + 2];
  data.push({ [key]: value });
  objectToFile({ data });
  console.log(`add key:${key} value:${value} success`);
};

// del
const del_option = () => {
  const option_item = "del";
  const key = argv[argv.indexOf(option_item) + 1];

  const newList = data.filter((item) => !item[key]);

  if (data.length === newList.length) {
    console.log("no key can del");
  } else {
    objectToFile({ data: newList });
    console.log(`del ${key} success`);
  }
};

// use
const use_option = () => {
  const option_item = "use";
  const key = argv[argv.indexOf(option_item) + 1];
  if (key.length > 0) {
    const item = data.find((item) => item[key]?.length > 0) || {};
    if (Object.keys(item).length > 0) {
      exec(`npm config set registry ${item[key]}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`exec error:${error}`);
          return;
        }

        console.log(`set registry ${item[key]} success`);
      });
    } else {
      console.log(`can not found ${key}`);
    }
  }
};

const OPTION_MAP = {
  "-v": version_option,
  "-V": version_option,
  ls: list_option,
  add: add_option,
  del: del_option,
  use: use_option,
};

const run = () => {
  const option_keys = Object.keys(OPTION_MAP);
  const option_item = argv.filter((item) => option_keys.includes(item));

  if (option_item.length > 0) {
    return OPTION_MAP[option_item[0]]();
  } else {
    console.log("no option can use");
  }
};

run();
