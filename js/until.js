window.log = console.log
var baseUrl = 'http://47.104.242.171:90'
var getHomeInfoApi = baseUrl + '/aosuite/api/esb/user/getHomeInfoApi?page=1&pageSize=2';
var saveJumpRecord = baseUrl + '/aosuite/api/esb/user/saveJumpRecord';
var getPicCodeApi = baseUrl + '/aosuite/api/esb/captcha/getPicCodeApi';
var sendSMSCodeApi = baseUrl + '/aosuite/api/esb/sms/sendSMSCodeApi';
var regAndLogin = baseUrl + '/aosuite/api/esb/user/regAndLogin';
Vue.use(Toast);
function http(type, url, data, ca){
	$.ajax({
	  type: type,
	  url: url,
	  data: type === 'post' ? JSON.stringify(data) : data,
	  contentType: 'application/json',
	  success: success,
	  dataType: 'json'
	});
	function success(res){
		if(!res.data){
			Vue.prototype.$toast.center(res.friendErrMsg);
			return ca && ca(false)
		}
		return ca && ca(res.data)
	}
}