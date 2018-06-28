function $l(...toLog) {
	if(toLog.length === 1)
		toLog = toLog[0]
	console.log(toLog)
}
function $get(url, successOrData, errorOrSuccess, error, withCredentials) {
	let request = new XMLHttpRequest()
	let Success
	let Error
	let data
	if(typeof successOrData == 'function') {
		Success = successOrData
		Error = errorOrSuccess !== undefined ? errorOrSuccess : () => {}
	}
	else if(typeof successOrData == 'object') {
		data = successOrData
		Success = errorOrSuccess
		Error = error !== undefined ? error : () => {}
	}
	if(data) {
		url += '?'
		for(key in data)
			url += key + '=' + data[key] + '&'
		url = url.slice(0, -1)
	}
	request.open('GET', url)
	request.withCredentials = withCredentials !== undefined ? withCredentials : true
	request.onreadystatechange = () => {
		if(request.readyState === 4) {
			try {
				rs = JSON.parse(request.responseText)
			} catch(e) {
				rs = request.responseText
			}
			if(request.status === 200) {
				if(!rs.hasOwnProperty('code'))
					Success(rs)
				else if(rs.code === 200 || rs.code === 0)
					Success(rs)
				else
					Error(rs)
			}
			else
				Error(rs)
		}
	}
	request.send()
}
function $post(url, data, success, error, type, withCredentials) {
	let request = new XMLHttpRequest()
	let postData = ''
	error = error ? error : () => {}
	request.open('POST', url)
	request.withCredentials = withCredentials !== undefined ? withCredentials : true
	if(type === undefined || type == 'form') {
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
		if(typeof(data) == 'object') {
			for(key in data)
				postData += key + '=' + data[key] + '&'
			postData = postData.slice(0, -1)
		}
	}
	else if(type == 'json') {
		request.setRequestHeader('Content-Type','application/json')
		postData = JSON.stringify(data)
	}
	request.onreadystatechange = () => {
		if(request.readyState === 4) {
			try {
				rs = JSON.parse(request.responseText)
			} catch(e) {
				rs = request.responseText
			}
			if(request.status === 200) {
				if(!rs.hasOwnProperty('code'))
					success(rs)
				else if(rs.code === 200 || rs.code === 0)
					success(rs)
				else
					error(rs)
			}
			else
				error(rs)
		}
	}
	request.send(postData)
}
function $ajax(method, url, data, header, success, error, withCredentials) {
	let request = new XMLHttpRequest()
	error = error ? error : () => {}
	request.open(method.toUpperCase(), url)
	for(key in header)
		request.setRequestHeader(key, header[key])
	request.withCredentials = withCredentials !== undefined ? withCredentials : true
	request.onreadystatechange = () => {
		if(request.readyState === 4) {
			try {
				rs = JSON.parse(request.responseText)
			} catch(e) {
				rs = request.responseText
			}
			if(request.status === 200) {
				if(!rs.hasOwnProperty('code'))
					success(rs)
				else if(rs.code === 200 || rs.code === 0)
					success(rs)
				else
					error(rs)
			}
			else
				error(rs)
		}
	}
	request.send(data)
}
function $e(id) {
    return typeof id == 'string' ? document.querySelector('#' + id) : id
}
function $v(elem, val) {
	elem = $e(elem)
	let tag = elem.tagName.toLowerCase()
    if(val === undefined)
		return elem.value === undefined ? elem.innerHTML : elem.value
	if(tag == 'input' || tag == 'select' || tag == 'textarea')
	{
		if(elem.type == 'checkbox')
			elem.checked = val
		else
			elem.value = val
	}
	else if(tag == 'a')
		elem.href = val
	else if(tag == 'img')
		elem.src = val
	else
		elem.innerHTML = val
}
function $q(name, url) {
    if(!url) url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url)
	if(!results) 
		return null
	if(!results[2]) 
		return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
function $ck(name, value, second) {
    if(value !== undefined) {
		let expires = ''
		let date = new Date()
		second = second ? second : 3600 * 24
		date.setTime(date.getTime() + second * 1000)
		expires = '; expires=' + date.toUTCString()
        document.cookie = name + '=' + (value || '')  + expires + '; path=/'
    } else {
        let nameEQ = name + '='
        let ca = document.cookie.split(';')
        for(let i = 0;i < ca.length;i++) {
            let c = ca[i]
            while (c.charAt(0)==' ') c = c.substring(1, c.length)
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
        }
        return null
    }
}
function $fd(fields, prefix) {
	let data = {}
	fields.forEach(field => {
		data[field] = document.querySelector('#' + (prefix !== undefined ? (prefix + '-' + field) : field)).value
	})
	return data
}
function $ff(prefix, fields) {
	for(let [key, val] of Object.entries(fields))
		$v(prefix + '-' + key, val)
}
function $aff(url, prefix) {
	$get(url, rs => {
		$ff(prefix, rs.data)
	})
}
function $pro(obj, property, split) {
	let attrs = Array.isArray(property) ? property : property.split(split ? split : '.')
	let rs = obj
	for(let i = 0;i < attrs.length;i++)
		if(obj[attrs[i]])
			rs = obj = obj[attrs[i]]
		else
			return undefined
	return rs
}
function $vex(exp, def, justify, modify) {
	let rs = null
	if(Array.isArray(exp)) {
		let pass = false
		for(let i = 0;i < exp.length;i++) {
			if(justify) {
				if(justify(exp[i])) {
					pass = true
					rs = exp[i]
				}
			}
			else {
				if(exp[i]) {
					if(Array.isArray(exp[i])) {
						if(exp[i].length !== 0) {
							pass = true
							rs = exp[i]
						}
					}
					else {
						pass = true
						rs = exp[i]
					}
				}
			}			
			if(pass)
				break
		}
		if(pass)
			return modify ? modify(rs) : rs
		else
			return def
	}
	if(justify) {
		if(modify)
			rs = justify(exp) ? modify(exp) : (def ? def : null)
		else
			rs = justify(exp) ? exp : (def ? def : null)
	}
	else {
		if(modify) {
			if(Array.isArray(exp))
				rs = exp.length !== 0 ? modify(exp) : (def ? def : null)
			else
				rs = exp ? modify(exp) : (def ? def : null)
		}
		else {
			if(Array.isArray(exp))
				rs = exp.length !== 0 ? exp : (def ? def : null)
			else
				rs = exp ? exp : (def ? def : null)
		}
	}
	return rs
}
function $vdf(...exp) {
	let elem = exp[exp.length - 1]
	for(let i = 0;i < exp.length;i++)
		if(exp[i])
			return exp[i]
	return elem
}
function $vlt(obj, ...exp) {
	for(let i = 0;i < exp.length;i++)
		if(obj && exp[i](obj))
			obj = exp[i](obj)
		else
			break
	return obj
}
function $date(date) {
    if(typeof date === 'number')
        date = new Date(date)
    else if(typeof date === 'string')
        date = new Date(Number.parseInt(date))
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
}
function $time(date) {
    if(typeof date === 'number')
        date = new Date(date)
    else if(typeof date === 'string')
        date = new Date(Number.parseInt(date))
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0')
}
function $timeCn(date) {
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let month = day * 30
    let now = new Date().getTime()
    let diffValue = now - date
    let monthC = diffValue / month
    let weekC = diffValue / (7 * day)
    let dayC = diffValue / day
    let hourC = diffValue / hour
    let minC = diffValue / minute
    if(monthC>=1)
        result = parseInt(monthC) + '个月前'
    else if(weekC>=1)
        result = parseInt(weekC) + '周前'
    else if(dayC>=1)
        result = parseInt(dayC) + '天前'
    else if(hourC>=1)
        result = parseInt(hourC) + '小时前'
    else if(minC>=1)
        result = parseInt(minC) + '分钟前'
    else
        result='刚刚'
    return result
}
function $notify(msg, className) {
	let tag = new $tag('div', msg, 'muyu-notify' + (className ? ' ' + className : ''))
	$add(document.body, tag)
	setTimeout(() => {tag.className += ' muyu-notify-open'}, 100)
	setTimeout(() => {tag.className += ' muyu-notify-close'}, 3500)
	setTimeout(() => {document.body.removeChild(tag)}, 5000)
}
function $click(btn, callback) {
	$e(btn).onclick = callback
}
function $enter(btn) {
	document.onkeydown = event => {
		if(event.keyCode === 13)
			$e(btn).click()
	}
}
function $tag(tag, val, className, click) {
	let elem = document.createElement(tag)
	if(val)
		$v(elem, val)
	if(className)
		elem.className = className
	if(click)
		$click(elem, click)
	return elem
}
function $add(parent, ...children) {
    children.forEach(child => {
        $e(parent).appendChild(child)
    })
}
function $hide(elem) {
    $e(elem).style.display = 'none'
}
function $show(elem, inline) {
    $e(elem).style.display = inline ? 'inline-block' : 'block'
}
function $change(elem, elems) {
	elems.forEach(e => {
		$hide(e)
	})
	$show(elem)
}
function $tran(elem, increment, second) {
	elem = $e(elem)
	let time = second ? second * 1000 : 1000
	let interval = setInterval(() => {
		$v(elem, Number.parseInt($v(elem)) + 1)
		if((increment > 0 ? --increment : ++increment) === 0)
			clearInterval(interval)
	}, time / increment)
}
function $toTop(btn, elem) {
	btn = $e(btn)
	elem = elem ? $e(elem) : document.documentElement
	let toListen = elem === document.documentElement ? window : elem
	let timer = null
    let isTop = true
	btn.style.display = 'none'
	toListen.addEventListener('scroll', () => {
		if(elem.scrollHeight - elem.clientHeight - elem.scrollTop < elem.scrollHeight / 2)
			btn.style.display = 'block'
		else 
			btn.style.display = 'none'
		if(!isTop)
			clearInterval(timer)
		isTop = false
	})
	btn.addEventListener('click', () => {
		timer = setInterval(() => {
			let osTop = elem.scrollTop
			var ispeed = Math.floor(-osTop / 6)
				elem.scrollTop = osTop + ispeed
			isTop = true
			if(osTop === 0)
				clearInterval(timer)
		}, 30)
	})
}
function $trim(str, mode) {
	mode = mode ? mode : 'both'
	if(mode == 'left')
		return str.replace(/(^\s*)/g, '')
	else if(mode == 'right')
		return str.replace(/(\s*$)/g, '')
	else if(mode == 'both')
		return str.replace(/(^\s*)|(\s*$)/g, '')
	return str
}
function $hideFooter(elem) {
	let footer = elem ? $e(elem) : document.querySelector('footer')
	let origin = window.innerHeight
	window.onresize = () => {
		footer.style.display = window.innerHeight < origin ? 'none' : 'block'
	}
}
function $pullToLoad(elem, callback, distance) {
    let content = $e(elem)
    let status = {
		load: true,
		page: 0,
	}
    content.addEventListener('scroll', () => {
        if(content.scrollHeight - content.clientHeight - content.scrollTop < (distance ? distance : 50) && status.load) {
			status.load = false
			status.page++
			callback(status)
        }
    })
}