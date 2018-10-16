window.log = console.log
var baseUrl = 'http://47.104.242.171:80'
var getHomeInfoApi = baseUrl + '/aosuite/api/esb/user/getHomeInfoApi';
var saveJumpRecord = baseUrl + '/aosuite/api/esb/user/saveJumpRecord';
var getPicCodeApi = baseUrl + '/aosuite/api/esb/captcha/getPicCodeApi';
var sendSMSCodeApi = baseUrl + '/aosuite/api/esb/sms/sendSMSCodeApi';
var regAndLogin = baseUrl + '/aosuite/api/esb/user/regAndLogin';
var getProductProtocol = baseUrl + '/aosuite/api/product/getProductProtocol';
Vue.use(Toast);
function http(type, url, data, ca, self){
	$.ajax({
	  type: type,
	  url: url,
	  data: type === 'post' ? JSON.stringify(data) : data,
	  contentType: 'application/json',
	  success: success,
	  dataType: 'json'
	});
	function success(res){
		if(res.errCode == 3){
			localStorage.clear();
			self.visite.protocol = false
			self.visite.mask = false
			self.visite.alert = false
			self.visite.login = true
			self.$toast.center(res.friendErrMsg);
			return ca && ca(false)
		}
		if(!res.data){
			self.$toast.center(res.friendErrMsg);
			return ca && ca(false)
		}
		return ca && ca(res.data)
	}
}