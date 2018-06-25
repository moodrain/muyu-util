function $locate(callback) {
	let map = new AMap.Map('map-hidden')
    if($ck('x') && $ck('y')) {
        callback($ck('x'), $ck('y'))
        return
    }
    map.plugin('AMap.Geolocation', () => {
        let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000,
        })
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', (data) => {
            let x = data.position.getLng()
            let y = data.position.getLat()
            // $ck('x', x, 300)
            // $ck('y', y, 300)
            callback(x, y)
        })
        AMap.event.addListener(geolocation, 'error', (data) => {
            $notice('定位超时，请刷新重试')
        })
    })
}
function $distance(x1, y1, x2, y2) {
    let map = new AMap.Map('map-hidden')
    let lnglat1 = new AMap.LngLat(x1, y1)
    let lnglat2 =  new AMap.LngLat(x2, y2)
    return Math.round(lnglat1.distance(lnglat2))
}
function $fileToBase(file, callback) {
	let reader = new FileReader()
	try {
		reader.readAsDataURL(file)
		reader.onload = () => {
			callback(reader.result)
		}
	} catch (e) {
		callback(null)
	}
}
function $imgSrcBase(src) {
	return src.split(' ').join('+')
}
function $$enterBtn(event, btn) {
	if(event.keyCode === 13)
		$e(btn).click()
}
function $$enter(listener, toRemove) {
	if(toRemove)
		document.removeEventListener('keydown', toRemove)
	document.addEventListener('keydown', listener)
}
function $$click(btn, listener, toRemove) {
	if(toRemove)
		$e(btn).removeEventListener('click', toRemove)
	$e(btn).addEventListener('click', listener)
}
function uniqid (prefix, moreEntropy) {
    if (typeof prefix === 'undefined')
        prefix = ''
    let retId
    let _formatSeed = (seed, reqWidth) => {
        seed = parseInt(seed, 10).toString(16)
        if (reqWidth < seed.length)
            return seed.slice(seed.length - reqWidth)
        if (reqWidth > seed.length) 
            return new Array(1 + (reqWidth - seed.length)).join('0') + seed
        return seed
    }
    let $global = (typeof window !== 'undefined' ? window : global)
    $global.$locutus = $global.$locutus || {}
    let $locutus = $global.$locutus
    $locutus.php = $locutus.php || {}
    if (!$locutus.php.uniqidSeed) {
        $locutus.php.uniqidSeed = Math.floor(Math.random() * 0x75bcd15)
    }
    $locutus.php.uniqidSeed++
    retId = prefix
    retId += _formatSeed(parseInt(new Date().getTime() / 1000, 10), 8)
    retId += _formatSeed($locutus.php.uniqidSeed, 5)
    if (moreEntropy)
        retId += (Math.random() * 10).toFixed(8).toString()
    return retId
}