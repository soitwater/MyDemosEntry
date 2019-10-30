// 辅助_比较readme与实际文件目录.js

let fs = require('fs')
let path = require('path')
const readline = require('readline')




// 按行读取文件
function getReadmeMarkdown(map, mapCount) {
  const rl = readline.createInterface({
    input: fs.createReadStream(`${pro}/README.md`)
  });

  rl.on('line', (line) => {
    line.replace(/\[(.+)\]\((.+)\)/, function (all, $1, $2) { 
      if (map[$1]) {
        map[$1].push($2)
      } else {
        map[$1] = [$2]
      }
    })
    line.replace(/\.\/(.+)\//, (all, $1) => {
      mapCount[$1] ? (++mapCount[$1]) : (mapCount[$1] = 1)
    })
  })
}

// 计算文件夹里的文件的数量
function countFilesInDir(filepath) {
  let results = 0
  let files = fs.readdirSync(filepath, 'utf8')
  files.forEach(function (file) {
    file = path.resolve(filepath, file)
    let stats = fs.statSync(file)
    if (stats.isFile()) {
      results++
    }
  })
  return results
}

// 获取文件列表
function getFilesListInDir(dir, dirName) {
  let results = []
  let files = fs.readdirSync(dir, 'utf8')
  files.forEach(function (file) {
    file = path.resolve(dir, file)
    let stats = fs.statSync(file)
    if (stats.isFile()) {
      results.push(file)
    }
  })
  results = results.map((el) => {
    el = el.replace(/\\/g, "/")
    el = './' + dirName + el.replace(new RegExp(dir, 'g'), '')
    return el
  })
  return results
}


// 文件前缀 - README.md 所在的文件夹
let pro = `E:/CSY/CCSY/基础/front-end-test`
// 存储:文件名 - 文件路径
let map = {}
// 存储：文件夹名 - 计数
let mapCount = {}

getReadmeMarkdown(map, mapCount)
setTimeout(() => {
  let errorNum = []
  for (let i of Object.keys(mapCount)) {
    let num = countFilesInDir(`${pro}/${i}`)
    if(num !== mapCount[i]) {
      errorNum.push({
        dirName: i,
        msg: `readme.md -> ${mapCount[i]}; but real -> ${num}; in -> ${i}`
      })
    }
  }
  for (let i of errorNum) {
    console.log(i.msg)
    let realFileList = getFilesListInDir(pro + '/' + i.dirName, i.dirName)
    let readmeFileList = []
    let diff = []
    for (let m in map) {
      if (map[m][0].indexOf(`./${i.dirName}/`) > -1) {
        readmeFileList.push(map[m][0])
      }
    }
    for (let r of realFileList) {
      if (!readmeFileList.includes(r)) {
        diff.push(r)
      }
    }
    // console.log('realFileList \n', realFileList)
    // console.log('readmeFileList \n', readmeFileList)
    console.log('diff \n', diff)
    console.log('___________________________\n\n\n')
  }
}, 3000)