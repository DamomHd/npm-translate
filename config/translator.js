const request = require('request-promise')
let crypto = require('crypto');

/**
 * 翻译器
 */
function Translator() {
  this.config = {
    from: 'auto',
    to: 'auto',
    appKey: '508c1dc69624a34a',
    secretKey: '70OquNPMBw1wq6kmH5PmZZgbEQTwCi0k',
  }
}

/**
 * md5加密
 */
Translator.prototype.md5 = function md5(str) {
  var crypto_md5 = crypto.createHash("md5");
  crypto_md5.update(str);
  return crypto_md5.digest('hex');
}

/**
* 生成[0,n]区间的随机整数
* 比如生成[0,100]的闭区间随机整数，getRandomN(100)
*/
Translator.prototype.getRandomN = function getRandomN(roundTo) {
  return Math.round(Math.random() * roundTo);
}

/**
 * {a:'111',b:'222'} => a=111&b=222
 */
Translator.prototype.generateUrlParams = function generateUrlParams(_params) {
  const paramsData = [];
  for (const key in _params) {
    if (_params.hasOwnProperty(key)) {
      paramsData.push(key + '=' + _params[key]);
    }
  }
  const result = paramsData.join('&');
  return result;
}

/**
 * 进行翻译
 */
Translator.prototype.translate = async function (word) {
  let youdaoHost = 'http://openapi.youdao.com/api';
  // 在get请求中，中文需要进行uri编码
  let encodeURIWord = encodeURI(word);
  let salt = this.getRandomN(1000);
  let sign = this.md5(this.config.appKey + word + salt + this.config.secretKey);
  let paramsJson = {
    q: encodeURIWord,
    from: this.config.from,
    to: this.config.to,
    appKey: this.config.appKey,
    salt: salt,
    sign: sign
  }
  // let url = `http://openapi.youdao.com/api?q=${encodeURI(q)}&from=${from}&to=${to}&appKey=${appKey}&salt=${salt}&sign=${sign}`;
  let url = youdaoHost + '?' + this.generateUrlParams(paramsJson);
  let result = await request.get({ url: url });
  return result;
}

module.exports = Translator;