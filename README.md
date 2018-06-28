muyu-util
=======
沐雨工具库
-------

> this lib uses es6 and require no dependency
>  
> 该库使用es6语法，无需其他依赖

### demo

* pull to load | 下拉加载

		$pullToLoad('goods-container', status => {
			$get('goods', {page: status.page}, rs => {
				rs.data.forEach(goods => {
					$add('goods-container', $tag('img', goods.img, 'goods-item', () => {
						window.open('goods/' + goods.id)
					}))
				})
				status.load = true
			})		
		})
 
### util list

util | function | detail
---- | --- |---
ajax | $ajax(method, url, data, header, success, [error], [withCredentials]) | all ajax function is withCredentials by default
ajax-get | $get(url, success, [error]) | status code isn't 200 and 'code' in reponse json isn't 0 or 200 will call error  
ajax-get | $get(url, data, success, [error], [withCredentials]) | data are key-values to generate query string after url
ajax-post | $post(url, data, success, [error], [type], [withCredentials]) | type can be 'form' (default) or 'json' 
getElement | $e(elem) | the same with document.getElementById()
get/setValue | $v(elem, [val]) | get value from attr of value of innerHTML, set value to attr of value,innerHTML,href,src according to tagName
query | $q(name, [url]) | get query param in url
get/setCookie | $ck(name, [value], [second]) | cookie expires in 1 day by default
getFormData | $fd(prefix, fields) | get value from each input that id is prefix + '-' + field
fillForm | $ff(prefix, fields) | set each input that id is prefix + '-' + field.key by field.value
ajaxFillForm | $aff(url, prefix) | the same to $get(url, rs => { $ff(prefix, rs.data) })
stampToDate | $date(date) |
stampToDatetime | $time(date) |
timeToChinese | $timeCn(date) |
notify | $notify(msg, [className]) | require muyu.css and use className to add your custom style
click | $click(elem, callback) | will cover the previous bind
enter | $enter(btn) | will trigger btn.click() when keydown enter, and will cover the previous bind
createElement | $tag(tag, [val], [className], [click]) | the same with document.createElement(tag) and call $v, $click or set className on it 
addChildren | $add(parent, ...children) | the same with parent.appendChild() on each child
clickToTop | $toTop(btn, [elem]) | the default elem is window
hideFooter | $hideFooter([elem]) | the default elem is the footer tag, hide footer when screen keyboard appears
pullToLoad | $pullToLoad(elem, callback, [distance]) | the default distance is 50, the callback receive an status object {load: bool, page: number}, set statu.load = true when finish loading
hideElement | $hide(elem) | the same with elem.style.display = 'none'
showElement | $show(elem, [inline]) | the same with elem.style.display = 'block' or 'inline-block'
changeElementToShow | $change(elem, elems) | hide all elems and show elem
getProperty | $pro(obj, property, [split]) | the default split is '.' 
valueExpress | $vex(exp, def, justify, modify) | too hard to explain
valueDefault | $vdf(...exp) | get the first exp that is true, and the last exp if none is true
valueLastTrue | $vlt(obj, ...exp) | get the previous once an exp is false, obj if the first exp is false
trim | $trim(str, [mode]) | mode can be 'left', 'right' or 'both' (default)
transitionNumber | $tran(elem, increment, [second]) | the default second is 1

