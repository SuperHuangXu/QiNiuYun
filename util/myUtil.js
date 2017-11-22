const request = require("request");
const fs = require("fs");
const key = require("./key");
const qiniu = require("qiniu");
const path = require("path");

/**
 * 文件下载
 * 示例：
 * const downloadUrl = new URL("http://ocaqc5g59.bkt.clouddn.com/js.png");
 * myUtil.downloadImage(downloadUrl, "./image/" + downloadUrl.pathname.slice(1));
 */
function downloadImage(url, filePath) {
      request
            .get(url.toString())
            .on('response', function (response) {
                  console.log(`${url} 下载成功！`);
            })
            .pipe(fs.createWriteStream(filePath));
}

/**
 * 七牛文件上传
 * key.AK 和 key.SK 在key.js中填写。
 * 
 */
const accessKey = key.AK;
const secretKey = key.SK;
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;

function qnUpdate(localFile, name) {
      return new Promise((resolve, reject) => {
            // 是否使用https域名
            config.useHttpsDomain = true;
            // 上传是否使用cdn加速
            config.useCdnDomain = true;

            const formUploader = new qiniu.form_up.FormUploader(config);
            const putExtra = new qiniu.form_up.PutExtra();
            const keys = name;
            // 上传到哪个 bucket ?
            const bucket = "blogimages";
            const options = {
                  scope: bucket,
            }
            const putPolicy = new qiniu.rs.PutPolicy(options);
            const uploadToken = putPolicy.uploadToken(mac);

            // 文件上传
            formUploader.putFile(uploadToken, keys, localFile, putExtra, function (respErr,
                  respBody, respInfo) {
                  if (respErr) {
                        throw respErr;
                  }
                  // 成功返回值 200
                  if (respInfo.statusCode == 200) {
                        // bucket 对应的 public url.
                        const bucketUrl = "http://ocaqc5g59.bkt.clouddn.com/";
                        // resolve
                        resolve(bucketUrl + respBody.key);
                  } else {
                        reject(`respInfo.statusCode: ${respInfo.statusCode}\n respBody: ${respBody}`);
                  }
            });
      });
}

module.exports = {
      downloadImage,
      qnUpdate
}