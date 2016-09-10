'use strict'

const execSync = require('child_process').execSync;
const fs = require('fs');
const co = require('co');
const readlineSync = require('readline-sync');
const VerEx = require('verbal-expressions');
const request = require('request');

const ROOT_DIR = `../../web`;
const DIR = `blog`; //とりあえずblogのみ

co(function *(){
    // let blog_id = inputId();
    let blog_id = `019`;
    let target_md = getMd(blog_id);
    let content = getArticle(target_md);
    let urls = getImageUrl(content);
    // console.log(content);
    // console.log(`\n\n--------\n\n`);
    // console.log(urls);

    for (let i = 0, len = urls.length; i < len; i++) {
        console.log(`${i+1}枚目のダウンロード開始...\n`);
        let mes = yield downloadImage(urls[i],blog_id, i);
        console.log(mes);
    }

    opneFinder(blog_id);
    rename(blog_id);
    console.log(`リネーム完了`);

    // console.log(content);
    // let res = yield [blog_id, target_md, content];
    // console.log(res);
    // => [1, 2, 3] 
}).catch(onerror);
 
function onerror(err) {
  // HANDLE ALL YOUR ERRORS!!! 
  console.error(err.stack);
}

//1. idを決める
function inputId() {
    let mes = `変換する記事の番号を入力して下さい(例:001) -> `;
    let type = readlineSync.question(mes);
    return type;
}

//2. idの記事を探す
function getMd(blog_id){
    let command = `ls ${ROOT_DIR}/content/${DIR}`;
    let target_md = ``;
    
    let result = `` + execSync(command);
    let tmp = result.split(`\n`);
    for (let i = 0, len = tmp.length; i < len; i++) {
        if (tmp[i].indexOf(blog_id) != -1) target_md = tmp[i]
    }
    return target_md;
}

//3. 記事の中身を取得
function getArticle(target_md){
    let content = fs.readFileSync(`${ROOT_DIR}/content/${DIR}/${target_md}`);
    return content.toString();
}

//4. 画像リスト取得
function getImageUrl(content){
    return content.split(`\n`).filter((element) => {
        return element.match(/!\[]\(http/gi);
    }); 
}

//5. 画像をDL
function downloadImage(url, blog_id, i){
    var url = url.match(/http[s]?\:\/\/[\w\+\$\;\?\.\%\,\!\#\~\*\/\:\@\&\\\=\_\-]+/g)[0];
    let path = `${ROOT_DIR}/static/img/${DIR}/${blog_id}/`;
    
    return new Promise((resolve, reject) => {
        request({method: 'GET', url: url, encoding: null},(error, response, body) => {
            if(error) reject(error);
            fs.writeFileSync(`${path}${i+1}_image.png`, body, 'binary');
            resolve(`done!`);
        });
    });
}

//6. Finderを開かせる
function opneFinder(blog_id){
    return execSync(`open ${ROOT_DIR}/static/img/${DIR}/${blog_id}/`);
}

//7. 画像をリネームさせる
function rename(){
    let mes = `画像を全てDLしました。画像のリネームをしてください。リネームが完了したらOKと入力してください -> `;
    let type = readlineSync.question(mes);
    if(type === `ok` | type === `OK`){
        return;
    }
}

    // return new Promise((resolve, reject) => {
    //     request({method: 'GET', url: url, encoding: null},(error, response, body) => {
    //         if(!error && response.statusCode === 200){
    //             fs.writeFileSync(`${path}a.png`, body, 'binary');
    //             console.log(`done`);
    //             resolve(`done`);
    //         }else{
    //             reject(`err`);
    //         }
    //     });
    // });


    // for(let i = 0,len = tmp.length; i < len; i++){
    //     if(tmp[i].match(/!\[]\(http/gi)){
    //         console.log(tmp[i]);
    //     }
    // }
    // let tmp = content.match(/http/gi);
    // var images = content.match(/png/gi);
    // var imagesURL = [];
    // console.log(images);
    // for (var i = 0, l = images.length; i < l; i++) {
    //     imagesURL.push(images[i].match(/src=["|'](.*?)["|']/)[1]);
    // }

    // console.log(tmp);


// return new Promise((resolve, reject) => {
    //     let result = `` + execSync(command);
    //     let tmp = result.split(`\n`);
    //     for (let i = 0, len = tmp.length; i < len; i++) {
    //         if (tmp[i].indexOf(blog_id) != -1) targetMD = tmp[i]
    //     }
    //     console.log(targetMD);
    //     if(targetMD === ``) reject(`err`);
    //     resolve(targetMD);
    //  });

// function _getFilename(dir, articlenum) {
//     let command = "ls content/"+dir;
//     let result = "" + execSync(command);
//     let tmp = result.split('\n');
//     let targetMD = '';
//     for (var i = 0, len = tmp.length; i < len; i++) {
//         if (tmp[i].indexOf(articlenum) != -1) targetMD = tmp[i]
//     }
//     return targetMD;
// }