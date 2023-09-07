import { esSafariIs12Plus } from '@/utils/USBkey/esstd_usbkey_util'
console.log("esstd_usbkey_websocket.js begins");

// 初始化一个 WebSocket 对象
// 注意!不同项目使用的端口号必须不一样
var esWsPort = 8666; // 使用的接口必须和websocket服务端监听的端口一致，请根据项目实际情况修改
var esWs = null;
var esWsError = false;
var esCurrentFunction = "";
var esWsResponse = null;
var esSafariExtensionId = "EsStdSafariExtensionSendMsg"; // safari扩展发送消息Id

export function esKeyInitialize() {
    // 不需要初始化
}

// 组织响应数据
function callBackFunction(funcName, response) {
    try {
        if (funcName == esCurrentFunction) {
            // 切成两部分
            var s = response.split("---");
            var ret = s[0]; // 执行结果
            var retData = "";
            if (s.length > 1 && s[1].length > 0) {
                retData = s[1]; // 响应数据
            }

            esWsResponse = { action: funcName, result: ret, responseData: retData };
        } else {
            funcName = esCurrentFunction;
            esWsResponse = { action: funcName, result: "E0600007", responseData: "" };
        }
    }
    catch (e) {
        console.log(e.message);
        esWsResponse = { action: funcName, result: "E0600007", responseData: "" };
    }
}

function DelayFunc(wsocket, funcName) {
    // 接收服务端数据时触发事件
    if (wsocket) {
        wsocket.onmessage = function (event) {
            var data = eval('(' + event.data + ')');
            var cmd = data.Type;
            var response = data.StringResult;

            callBackFunction(cmd, response);
            wsocket.onmessage = null;
        };
    } else {
        window.addEventListener("message", function handleNativeMessage(event) {
            if (event.source != window) {
                return;
            }

            var cmd = event.data.type;
            var response = event.data.text;

            callBackFunction(cmd, response);
            window.removeEventListener(event.type, handleNativeMessage);
        }, false);
    }
}

// WebSocket连接被关闭时触发
function onWsClose() {
    console.log("WebSocket连接已关闭...");
    esWs = null;
    esWsError = true;
};

function onWsError() {
    console.log("WebSocket错误...");
    esWsError = true;
}

function WsSend(wsocket, funcName, data) {
    wsocket.send(data);
    DelayFunc(wsocket, funcName);
}

function Callxx(funcName, input) {
    return new Promise(function (resolve, reject) {
        try {
            var strData = JSON.stringify(input);

            if (esCurrentFunction.length > 0) {
                reject("前一个操作尚未完成，请稍后再试。");
                return;
            }
            if (esSafariIs12Plus()) {
                var event = new CustomEvent(esSafariExtensionId, { 'detail': strData });
                window.dispatchEvent(event);
                DelayFunc(null, funcName);
            }
            else {
                esWsError = false;
                if (!esWs || 1 != esWs.readyState) {
                    console.log("准备建立WebSocket连接...");
                    esWs = new WebSocket("ws://localhost:" + esWsPort);
                    esWs.onclose = onWsClose;
                    esWs.onerror = onWsError;

                    esWs.addEventListener('open', function (event) {
                        esWs.onopen = null;
                        WsSend(esWs, funcName, strData);
                    });
                } else {
                    WsSend(esWs, funcName, strData);
                }
            }

            esWsResponse = null;
            esCurrentFunction = funcName;
            var check = setInterval(function () {
                if (esWsError) {
                    esCurrentFunction = "";
                    esWsResponse = null;
                    clearInterval(check);
                    reject("接收数据异常，请确认本地WebSocket服务器已启动后重试 ");
                    return;
                }
                if (esWsResponse) {
                    var data = esWsResponse;

                    esCurrentFunction = "";
                    esWsResponse = null;

                    clearInterval(check);

                    // 根据错误码来决定是抛出异常还是正确结果
                    if (0 == parseInt(data.result, 16)) {
                        resolve(data.responseData);
                    }
                    else {
                        reject(data.result);
                    }
                    return;
                }
            }, 50);
        }
        catch (e) {
            reject(e);
            return;
        }
    });
}

function promiseExit() {
    // 简单粗暴地终止后续的then调用
    return new Promise(function () { });
}

// device operation
export function esKeyEnum() {
    var ret;

    try {
        var funName = "esKeyEnum";
        var input = { "Type": funName };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esKeyInit(sn) {
    var ret;

    try {
        var funName = "esKeyInit";
        var input = { "Type": funName, "KeySn": sn };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esKeyGetPinMaxRetry(sn, pinType) {
    var ret;

    try {
        var funName = "esKeyGetPinMaxRetry";
        var input = { "Type": funName, "KeySn": sn, "PinType": pinType };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esKeyGetPinRetry(sn, pinType) {
    var ret;

    try {
        var funName = "esKeyGetPinRetry";
        var input = { "Type": funName, "KeySn": sn, "PinType": pinType };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esKeyCheckDefaultPin(sn, pinType) {
    var ret;
    try {
        var funName = "esKeyCheckDefaultPin";
        var input = { "Type": funName, "KeySn": sn, "PinType": pinType };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

export function esKeyVerifyPin(sn, pinType, pin) {
    var ret;
    try {
        var funName = "esKeyVerifyPin";
        var input = { "Type": funName, "KeySn": sn, "PinType": pinType, "Pin": pin };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        console.log('ret:',ret)
        return ret;
    }
}

function esKeyChangePin(sn, pinType, oldPin, newPin) {
    var ret;
    try {
        var funName = "esKeyChangePin";
        var input = { "Type": funName, "KeySn": sn, "PinType": pinType, "Pin": oldPin, "NewPin": newPin };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esKeyUnblockPin(sn, soPin, userPin) {
    var ret;
    try {
        var funName = "esKeyUnblockPin";
        var input = { "Type": funName, "KeySn": sn, "SoPin": soPin, "NewPin": userPin };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esKeyHash(hashAlg, msg) {
    var ret;

    try {
        var funName = "esKeyHash";
        var input = { "Type": funName, "HashAlg": hashAlg, "InputMsg": msg };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

// certRequest
function esKeyGenKeyPair(sn, certType, keyLimit) {
    var ret;
    try {
        var funName = "esKeyGenKeyPair";
        var input = { "Type": funName, "KeySn": sn, "CertType": certType, "KeyLimit": keyLimit };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esConstructCertReqInfo(certType, dn, pubKeySign, pubKeyWrap) {
    var ret = "";

    try {
        var funName = "esConstructCertReqInfo";
        var input = { "Type": funName, "CertType": certType, "CertDn": dn, "PubKeySign": pubKeySign, "PubKeyWrap": pubKeyWrap };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        return ret;
    }
}

// cert_usage
export function esKeyEnumCert() {
    var ret;

    try {
        var funName = "esKeyEnumCert";
        var input = { "Type": funName };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esKeySelectCertByDlg() {
    var ret;

    if (esIsEdge()) {
        throw "由于EDGE浏览器权限问题，不允许弹出选择对话框。此功能暂不可用！"
    }

    try {
        var funName = "esKeySelectCertByDlg";
        var input = { "Type": funName };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esKeyGetSnByCert(dn) {
    var ret;

    try {
        var funName = "esKeyGetSnByCert";
        var input = { "Type": funName, "CertDn": dn };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esVerifySignature(cert, hashAlg, data, signature) {
    var ret;

    try {
        var funName = "esVerifySignature";
        var input = { "Type": funName, "CertData": cert, "HashAlg": hashAlg, "InputMsg": data, "Signature": signature };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esKeyReadCert(dn, signCert) {
    var ret;

    try {
        var funName = "esKeyReadCert";
        var input = { "Type": funName, "CertDn": dn, "CertUsage": signCert };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

function esReadFile(file) {
    var ret;

    try {
        var funName = "esReadFile";
        var input = { "Type": funName, "FileName": file };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e);
        return;
    }
    finally {
        return ret;
    }
}

// certRequest
function esKeySign(certDn, hashAlg, inputMsg) {
    var ret = "";

    try {
        var funName = "esKeySign";
        var input = { "Type": funName, "CertDn": certDn, "HashAlg": hashAlg, "InputMsg": inputMsg };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        return ret;
    }
}

function esConstructP10(reqInfo, signCertReq, hashAlg) {
    var ret = "";

    try {
        var funName = "esConstructP10";
        var input = { "Type": funName, "CertReqInfo": reqInfo, "Signature": signCertReq, "HashAlg": hashAlg };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        return ret;
    }
}

function esIssueCert(p10) {
    var ret = "";

    try {
        var funName = "esIssueCert";
        var input = { "Type": funName, "P10": p10 };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        return ret;
    }
}

function esKeyImportCert(signCert, symmkey, prikey, encCert) {
    var ret = "";

    try {
        var funName = "esKeyImportCert";
        var input = { "Type": funName, "SignCert": signCert, "EncSymmKey": symmkey, "EncPriKey": prikey, "EncCert": encCert };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        return ret;
    }
}

export function esKeyAsymEnc(dn, inputData) {
    var ret = "";

    try {
        var funName = "esKeyAsymEnc";
        var input = { "Type": funName, "CertDn": dn, "InputMsg": inputData };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        return ret;
    }
}

function esKeyAsymDec(dn, inputData) {
    var ret = "";

    try {
        var funName = "esKeyAsymDec";
        var input = { "Type": funName, "CertDn": dn, "InputMsg": inputData };
        ret = Callxx(funName, input);
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        return ret;
    }
}

console.log("esstd_usbkey_websocket.js ends");
