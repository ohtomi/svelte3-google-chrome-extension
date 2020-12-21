// フォーマットを整える
var formattedText = formatFromPopup
formattedText = formattedText.replace('$title', document.title)
formattedText = formattedText.replace('$url', document.location.href)
formattedText = formattedText.replace('$selection', window.getSelection().toString())
formattedText = formattedText.replace('$lf', '\n')

// クリップボードへコピーする
var $textarea = document.createElement('textarea')
$textarea.value = formattedText
document.body.appendChild($textarea)
$textarea.select()
document.execCommand('copy')
document.body.removeChild($textarea)
