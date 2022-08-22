# excelJs简单应用

## 一、项目前提
&emsp;&emsp;公司业务需要一个纯前端的导出excel的功能于是只能自己搞了，一通搜索研究后，大致有三种解决方案:

1. xlxs+xlsx-style
2. sheetJs:xlsxPro版
3. excelJs

&emsp;&emsp;本着学习一下的心态（主要刚到新公司没有活，有点无聊），把三种方案都尝试了一遍，各有优缺点：

1. xlxs+xlsx-style:xlxs用来创建表，xlsx-style用来写入样式，简单易上手，代码量少，但用在vue3中xlsx-style会有bug,网上有很多解决办法，全都尝试了一遍，无果，最终放弃。
2. sheetJs Pro:xlxs的Pro版，较社区版增加了很多功能([Pro版额外功能](https://sheetjs.com/pro))，可以说十分方便，但是需要氪金(大约$750)才能换取来这些功能，摸了摸自己扁扁的口袋，放弃了。
2. excelJs：简单看了一下api，发现跟xlxs语法比较相似，而且简化很多，在导出方面很是方便，但解析就不太好用。正好我只需要导出功能，于是直接npm install,开始撸代码。


### 简易导出功能函数完全体
```
/**
 *
 * @param {*} json 表格数据，对象数组
 * @param {*} tHead 表头，数组，定义表头和对应的键,eg:{header:'年龄',key:'age'}
 * @param {*} fileName 导出文件的文件名
 * @param {*} sheetName 导出文件的表名
 */

export const exportByExcelJs = (json, tHead, fileName = '导出文件', sheetName = 'Sheet1') => {
  //初始化一个工作表，填充一些基础信息
  let workbook = new ExcelJS.Workbook()
  workbook.creator = 'ExcelJS'
  workbook.created = new Date()
  workbook.modified = new Date()
  let worksheet = workbook.addWorksheet(sheetName)

  //无表头抛出错误,存在表头就设置表头，并用addRows添加我们要导出的数据
  if (!!!tHead) {
    throw new Error('Missing table header')
  }
  worksheet.columns = tHead
  worksheet.addRows(json)

  //设置表头样式
  let style = {
    font: {
      name: '宋体',
      size: 11,
      bold: true,
      color: { argb: '#00000000' }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: false
    },
    border: {
      top: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'b2b2b200' }
      // bgColor: { argb: 'FF0000FF' }
    }
  }

  //遍历工作表，给需要添加样式的单元格添加相应的样式
  for (let i = 1; i < worksheet._columns.length + 1; i++) {
    let cellName = getColumnNameByIndex(i - 1) + 1
    worksheet.getCell(cellName).style = style
    let maxLen = 0
    for (let k = 1; k < worksheet._rows.length + 1; k++) {
      worksheet.getRow(k).height = 13.5 //行高
      // 计算列自适应宽度，限制最宽为20（一个中文字符宽度为2，英文和数字宽度为1.5）
      let cellValue = worksheet.getCell(getColumnNameByIndex(i - 1) + k).value
      let strLen = 0
      if (cellValue !== null && cellValue !== '') {
        cellValue = cellValue.toString()
        let chVal = cellValue.match(/[\u4e00-\u9fa5]/g)
          ? cellValue.match(/[\u4e00-\u9fa5]/g).join('')
          : ''
        let engVal = cellValue.replace(/([^\u0000-\u00FF])/g, '') || ''
        strLen += chVal.length * 2 + engVal.length * 1.5
        if (strLen > maxLen) {
          maxLen = strLen
        }
      }
    }
    maxLen > 20 ? (maxLen = 20) : null
    worksheet.getColumn(i).width = maxLen //列宽
  }

  // 导出
  workbook.xlsx.writeBuffer().then(function (buffer) {
    fileSaver(
      new Blob([buffer], {
        type: 'application/octet-stream'
      }),
      `${fileName}.xlsx`
    )
  })
}

//通过列数获取excel表头编号
const getColumnNameByIndex = i => {
  let result = String.fromCharCode('A'.charCodeAt() + (i % 26))
  while (i >= 26) {
    i /= 26
    i--
    result = String.fromCharCode('A'.charCodeAt() + (i % 26)) + result
  }
  return result
}
```
如果还需要其他设置，可以查看官方文档。
### [官方文档(中文)](https://github.com/exceljs/exceljs/blob/master/README_zh.md)



