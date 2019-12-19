let fs = require('fs')
// Readme.md 的标题
let title = "# 计算机基础知识笔记"
// 目标文件夹
let pre = `E:/CSY/CCSY/基础/cs-foundation`
// 需要被忽略的文件夹名 or 文件名
let ignore = {
  document: ['.git', 'assets'],
  filename: ['README.md']
}
// 存储文件目录结构
let result = {}
// 遍历文件目录并存储到变量 result
ScanDir(pre, '')
let data = title + '\n'
for (let i in result) {
  let list = ''
  for (let arr of result[i]) {
    list += `- [${arr.name}](${arr.path})\n`
  }
  data += `
<details>
  <summary>${i}</summary>
  
${list}
</details>
  `
}
// console.log(result)
// console.log(data)
createReadme(data)



// 文件目录结构存储在全局变量result
// attr 是 文件名,即 result 的属性名
function ScanDir(path, attr) {
  // 当前的path 是否为文件
  const isFile = fs.statSync(path).isFile()
  // 假如是文件
  if (isFile) {
    // 判断是否为应忽略的文件，若否:则
    !checkIgnore(attr, isFile) && result[getDocumentNameByFilename(path, attr)].push({
      name: attr.slice(0, attr.lastIndexOf('.')),
      path: path.replace(pre, '.')
    });
    return
  }
  try {
    // 若为应忽略的文件夹，则
    if (checkIgnore(attr, isFile)) {
      delete result[attr]
      return
    };
    fs.readdirSync(path).forEach(function (file) { // 遍历文件夹目录下的所有文件
      let documentPath = path + '/' + file
      let documentName = documentPath.slice(documentPath.lastIndexOf('/') + 1)
      // result 中还没有documentName 属性值 且 当前的路径不是文件时，才...
      if (!result[documentName] && !fs.statSync(documentPath).isFile()) {
        result[documentName] = [];
      }
      ScanDir(documentPath, documentName)
    })
  } catch (err) {
    console.log('err!!!\n', err)
  }

  // 获取当前文件所处的文件夹名字
  function getDocumentNameByFilename(path, name) {
    let pathWithoutFilename = path.slice(0, path.length - name.length - 1)
    return pathWithoutFilename.slice(pathWithoutFilename.lastIndexOf('/') + 1)
  }
  // 检查当前路径是否应忽略的文件夹 or 文件名
  function checkIgnore(file, isFile) {
    if (isFile) {
      return ignore.filename.includes(file)
    } else {
      return ignore.document.includes(file)
    }
  }
}

// 创建并写入Readme.md 文件
function createReadme(data) {
  let path = pre + '/README' + new Date().valueOf() + '.md'
  fs.writeFileSync(path, data, (err) => {
    if (err) console.log('err in create Readme.md!!\n' + err)
    else console.log(`succ at ${path}`)
  })
}