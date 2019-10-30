// 打开页面：https://github.com/soitwaterdemos
// 将下面的JS复制后在浏览器控制台中运行
// 可以获得所有仓库的名字与链接

let h3a = Array.from(document.querySelectorAll('h3>a'))
let str = ''

for(let i of h3a) {
  str += i.innerText + '|' + i.parentElement.nextElementSibling.innerText + '|[跳转](' + i.href + ')\n'
}
console.log(str)