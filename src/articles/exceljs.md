# excelJs简单应用

## 一、项目前提
&emsp;&emsp;主要是最近换了新公司，刚来主要做SASS系统，之前一直做h5和微信小程序，管理后台也有做，但都不是很复杂。新公司主要是toB业务，卖的产品就是SASS,所以对后台的要求比较高，接手了一个新系统，让做一个根据纯前端的导出excel功能试试手，扒了扒老代码发现没有纯前端的导出功能，于是只能自己搞了。

&emsp;&emsp;在google一通搜索，大致有三种解决方案:

1. xlxs+xlsx-style
2. sheetJs
3. excelJs

&emsp;&emsp;本着学习一下的心态（主要刚到新公司没有活，有点无聊），把三种方案都尝试了一遍，各有优缺点：

1. xlxs+xlsx-style:xlxs用来创建表，xlsx-style用来写入样式，简单易上手，代码量少，但用在vue3中xlsx-style会有bug,网上有很多解决办法，全都尝试了一遍，无果，最终放弃。
2. sheetJs:包都下好了，准备看看api开始整，发现区分专业版和丐版，丐版不能导出有样式的excel，好了果断转移阵地。
3. excelJs：简单看了一下api，发现跟xlxs语法比较相似，而且简化很多，于是直接npm install,开始撸代码。

```
/**
 *
 * @param {*} json 表格数据，对象数组
 * @param {*} tHead 表头，数组，定义表头和对应的键,eg:{header:'年龄',key:'age'}
 * @param {*} fileName 导出文件的文件名
 * @param {*} sheetName 导出文件的表名
 */

export const exportByExcelJs = (json, tHead, fileName = '导出文件', sheetName = 'Sheet1') => {
  //init
  let workbook = new ExcelJS.Workbook()
  workbook.creator = 'ExcelJS'
  workbook.created = new Date()
  workbook.modified = new Date()
  let worksheet = workbook.addWorksheet(sheetName)
  if (!!!tHead) {
    throw new Error('Missing table header')
  }
  worksheet.columns = tHead
  worksheet.addRows(json)

  //表头样式
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

  //设置单元格样式
  for (let i = 1; i < worksheet._columns.length + 1; i++) {
    let cellName = getColumnNameByIndex(i - 1) + 1
    worksheet.getCell(cellName).style = style
    let maxLen = 0
    for (let k = 1; k < worksheet._rows.length + 1; k++) {
      worksheet.getRow(k).height = 13.5 //行高
      // 计算列自适应宽度，最宽为20（一个中文字符宽度为3，英文和数字宽度为1.5）
      let cellValue = worksheet.getCell(getColumnNameByIndex(i - 1) + k).value
      let strLen = 0
      if (cellValue !== null && cellValue !== '') {
        cellValue = cellValue.toString()
        let chVal = cellValue.match(/[\u4e00-\u9fa5]/g)
          ? cellValue.match(/[\u4e00-\u9fa5]/g).join('')
          : ''
        let engVal = cellValue.replace(/([^\u0000-\u00FF])/g, '') || ''
        strLen += chVal.length * 3 + engVal.length * 1.5
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