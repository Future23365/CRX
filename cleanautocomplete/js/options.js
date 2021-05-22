const button = document.querySelector('button')
const span = document.querySelector('span')
    button.addEventListener('click', function() {
        chrome.storage.local.clear(function() {
            span.innerHTML = "清除成功"
        })
    })