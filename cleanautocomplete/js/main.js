let urls = {};
let clearId = ''
const input = document.querySelectorAll('input');
const countNumber = []
chrome.storage.local.get('clearautocomplete', (re) => {
    if(JSON.stringify(re) == "{}") {
        urls = {}
    } else {
        urls = re.clearautocomplete
    }
    input.forEach((item, index) => {
        countNumber.push(0)
        if((location.origin + location.pathname) in urls) {
            if(urls[location.origin + location.pathname].includes(item.id)) {
                item.setAttribute("autocomplete", "off")
            }
        }
        item.addEventListener('click', (e) => {clickFive(e, index)})
    })
})

function clickFive(e, index) {
    if(clearId) {
        clearTimeout(clearId)
    }
    countNumber[index - 1] ++
    clearId = setTimeout(() =>{
        countNumber[index - 1] = 0
    }, 1000)
    if(countNumber[index - 1] === 5) {
        countNumber[index - 1] = 0
        createEl(e.target)
    }
}

function createEl(el) {
    const div = document.createElement('div')
    div.style.height = el.getBoundingClientRect().height + 'px'
    div.style.position = 'fixed'
    div.style.width = el.clientWidth + 'px'
    div.style.top = el.getBoundingClientRect().top - el.getBoundingClientRect().height + 'px'
    div.style.left = el.getBoundingClientRect().left + 'px'
    div.style.display = 'flex'
    div.style.justifyContent = 'center'
    const openDiv = document.createElement('button')
    openDiv.style.margin = "0 5px"
    openDiv.innerHTML = '隐藏历史记录'
    const closeDiv = document.createElement('button')
    closeDiv.innerHTML = '开启历史记录'
    const hiddenDiv = document.createElement('button')
    hiddenDiv.innerHTML = "X"
    div.appendChild(openDiv)
    div.appendChild(closeDiv)
    div.appendChild(hiddenDiv)
    openDiv.addEventListener('click', (e) => {
        e.preventDefault()
        el.setAttribute("autocomplete", "off")
        if(urls[location.origin + location.pathname]) {
            urls[location.origin + location.pathname].push(el.id)
        } else {
            urls[location.origin + location.pathname] = [el.id]
        }
        chrome.storage.local.set({clearautocomplete: urls})
        chrome.storage.local.get('clearautocomplete', () => {
            
        })
        div.style.display = 'none'
    })
    closeDiv.addEventListener('click', (e) => {
        e.preventDefault()
        el.removeAttribute('autocomplete')
        if(urls[location.origin + location.pathname]) {
            urls[location.origin + location.pathname] = urls[location.origin + location.pathname].filter((element) => {
                return element !== el.id
            })
        }
        chrome.storage.local.set({clearautocomplete: urls})
        div.style.display = 'none'
    })
    hiddenDiv.addEventListener('click', (e) => {
        e.preventDefault()
        div.style.display = 'none'
    })
    el.parentNode.insertBefore(div, el)
    el.addEventListener('blur', () => {
        setTimeout(() => {
            div.style.display = 'none'
        }, 500)
    })
}
