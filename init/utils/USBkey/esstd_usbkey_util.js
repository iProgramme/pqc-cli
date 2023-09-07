exports.esstd_usbkey_util = `console.log("esstd_usbkey_util.js begins");

function esGetBrowserInfo() {
	var browser = {};
	var ua = navigator.userAgent.toLowerCase();
	var m = null;
	var ver = null;

	browser.name = "";
	browser.ver = 0;

	// 先获取版本号
	// 某些浏览器（比如safari）的ua会有专门的version/xx 这样的内容
	m = ua.match(/(version).*?([\d.]+)/)
	if ( (m != null) && (m != undefined) ) {
		ver = parseInt(m[2], 10);
	}
	
	// 说明:
	// 1. 我们获取浏览器名字和版本的目的是为了区分他们使用的控件/扩展技术，
	//    不需要非常精确，比如edge浏览器的新版本基于chrome内核开发，扩展技术是共通的
	//    我们可以当作chrome浏览器返回
	// 2. 现代浏览器大多基于webkit或chromium编写，ua会包括safari或chrome字样
	//    chromium也是基于webkit编写的，chrome浏览器的ua也会包括safari
	//    故做浏览器ua匹配时，从后往前顺序为safari、chrome和其他
	// 3. IE的不一定获取到，使用时另外判断

	// 1. 匹配其他浏览器
	m = ua.match(/(msie|firefox|edge|opera).*?([\d.]+)/)
	if ( (m != null) && (m != undefined) ) {
		browser.name = m[1];
		browser.ver = parseInt(m[2], 10);
	} else {
		// 2. 找chrome
		m = ua.match(/(chrome).*?([\d.]+)/);
		if ( (m != null) && (m != undefined) ) {
			browser.name = m[1];
			browser.ver = parseInt(m[2], 10);
		} else {
			// 3. 最后找safari
			m = ua.match(/(safari).*?([\d.]+)/);
			if ( (m != null) && (m != undefined) ) {
				browser.name = m[1];
				browser.ver = parseInt(m[2], 10);
			}
		}
	}

	// 优先使用version后的版本号
	if ( ver != null ) {
		browser.ver = ver;
	}
	if ( ("edge" == browser.name) && ver < 50 ) {
		// edge低版本（非chromium核心）返回的版本好是EdgeHtml的，不是浏览器的
		// 从一些系统来看，EdgeHtml版本号比Edge版本号小26左右
		// 做一下补偿（TODO: 如果要求非常精确版本，那么需要研究如何获取）
		browser.ver += 26;
	}
	
	return browser;
}
var esBrowserInfo = esGetBrowserInfo();

function esOsIsWindows() {
	if ( /windows|win32/i.test(navigator.userAgent) )  
	{
		return true; 
	}
	return false;
}

function esOsIsMac() {
	if ( /macintosh|mac os x/i.test(navigator.userAgent) )  
	{
		return true; 
	}
	return false;
}

function esOsIsLinux() {
	if ( String(navigator.platform).indexOf("Linux")>-1 )  
	{
		console.log('linux====')
		return true; 
	}
	return false;
}

// chrome 42开始支持NativeMessage，以下版本默认支持npapi
function esChromeIs42Plus() {
	if ( "chrome" == esBrowserInfo.name && 42 <= esBrowserInfo.ver )
	{
		return true;
	}
	return false;
}

// firefox 52开始支持NativeMessage
function esFirefoxIs52Plus() {
	if ( ("firefox" == esBrowserInfo.name) && (esBrowserInfo.ver>=52) )
	{
		return true;
	}	
	return false;
}

// fireforx 64位的42~51版本不支持npapi，也不支持NativeMessage
function esFirefoxIsX64And42Plus() {
	if ( "firefox" == esBrowserInfo.name )
	{
		if ( /win64/i.test(navigator.userAgent) )  
		{
			if ( 42 <= esBrowserInfo.ver ) 
			{
				return true;
			}
		}
	}	
	return false;
}

// macOS safari 12开始支持新的App扩展，以下版本支持npapi
export function esSafariIs12Plus() {
    
	if ( "safari" == esBrowserInfo.name && 12 <= esBrowserInfo.ver )
	{
       
		return true;
	}
	return false;
}

function esIsEdge() {
	if ( "edge" == esBrowserInfo.name )
	{
		return true;
	}	
	return false;
}

function esIsIE () {
	if (!!window.ActiveXObject || "ActiveXObject" in window)  
	{
		return true;
	}
	return false;
}

/**
 * @brief 获取浏览器支持的插件类型
 * 
 * @returns 0: 未知
 *          1: ATL
 *          2: NPAPI
 *          3: Native Message
 *          4: WebSocket
 *          5: Native Message 或 WebSocket都可以
 */
function esPluginType () {
	// 注意，以下判断逻辑请项目
	if ( esOsIsWindows() ) {
		// Windows: 
		if ( esIsIE() ) {
			return 1;
		} else if ( esIsEdge() || esChromeIs42Plus() || esFirefoxIs52Plus() ) {
			// Native Message和WebSocket都可以
			return 5;
		} else if ( esFirefoxIsX64And42Plus() ) {
			// 不支持npapi也不支持nativemessage
			return 4;
		}

		// 其他版本默认使用NPAPI
		return 2;
	}
	else if ( esOsIsMac() ) {
		if ( esSafariIs12Plus() ) {
			// 12开始使用基于消息的扩展
			return 3;
		}

		// 旧版本使用NPAPI
		return 2;
	}
	else if ( esOsIsLinux() ) {
		// 仅使用WebSocket
		return 4;
	}
	else {
		// This browser is not supported now!
		return 0;
	}
}

console.log("esstd_usbkey_util.js ends");
`