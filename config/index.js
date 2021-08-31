#!/usr/bin/env node


const colors = require('colors')
const say = require('say');
const argv = require("yargs").argv,
  queryStr = encodeURI(argv._.join(" "));

  const Translator = require('./translator');
  let translator = new Translator();

if (!queryStr) {
  console.log("输入单词或短句[-S, --say]")
} else {
  if (argv.say == true || argv.S == true) {
    console.log("播放中...".rainbow);
    say.speak(queryStr);
    return;
  }
  // 查询
  translate(queryStr)
}

async function translate(query) {
  let resultStr = await translator.translate(query).catch(e => {
    console.log('查询异常，稍后重试')
  })
  format(resultStr)
}
//格式化
function format(json) {
  let data = JSON.parse(json),
    pronTitle = "发音：",
    pron = data.basic ? data.basic.phonetic : "无",
    mainTitle = "翻译：",
    mainTrans = "",
    webTitle = "网络释义：",
    machineTrans = "",
    webTrans = "",
    template = "";
  let basic = data.basic,
    web = data.web,
    translation = data.translation;
  if (basic ? basic : "") {
    for (let i = 0; i < basic.explains.length; i++) {
      mainTrans += "\n" + basic.explains[i];
    }
  }
  if (web ? web : "") {
    for (let i = 0; i < web.length; i++) {
      webTrans +=
        "\n" +
        (i + 1) +
        ": " +
        web[i].key.red.bold +
        "\n" +
        web[i].value.join(",");
    }
  }
  translation ? (machineTrans = translation) : false;
  template =
    pronTitle.red.bold +
    pron +
    "\n" +
    mainTitle.green.bold +
    mainTrans +
    "\n" +
    webTitle.blue.bold +
    webTrans +
    "\n" +
    "机器翻译：".green.bold +
    machineTrans;
  console.log(template);
}