1. 高亮替换
```
    const highlightText = (originalText, keyword) => {
        if (!keyword) return originalText
        const regex = new RegExp(`(${keyword})`, 'gi')
        const highlightedText = originalText.replace(regex, '<span style="color: #514DEF;">$1</span>')
        return highlightedText
    }
```