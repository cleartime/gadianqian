new Vue({
	 el: '#app',
	data: function(){
		return {
			home: {
				banerList: [],
				hotRecoList: [],
				popupsList: [],
				productList: []
			},
			visite: {
				alert: false,
				login: false,
				mask: false,
			},
			tipIconSwitch: false,
			picImgUrl: '',
			picImg: {},
			isSend: false,
			picVerifyCode: '',
			num: 59,
			login: {
				mobilePhone: '',
				smsCode: '',
				flag: 'MSG_REG',
				from: 1,
				device : ''
			}
		}
	},
	computed: {
		'user': function(){
			return localStorage.user 
			? JSON.parson(localStorage.user )
			: {juid:''}
		},
		'tipIconUrl': function(){
			return `/images/${this.tipIconSwitch ? 'succ' : 'kong'}.png`
		}
	},
	created: function (argument) {
		this.init();
	},
	mounted: function(){
		this.getPicCodeApi()
	},
	methods: {
		init: function(){
			http('get', getHomeInfoApi, null, function(res){
				this.home = res;
				if (this.home.popupsList.length) {
					this.visite.mask = true
					this.visite.alert = true
				}
				this.$nextTick(function(){
					this.banner()
				})
			}.bind(this))
		},
		linkto: function(item, type){
			if (!this.user.juid) {
				this.visite.mask = false
				this.visite.alert = false
				this.visite.login = true
				return
			}
			var data = {
				productId: item.productId || '',
				position: type,
				from: 1,
				linkUrl: item.linkUrl
			}
			http('get', getHomeInfoApi, data)
			if (item.linkUrl) {
				location.href = item.linkUrl;
			}
		},
		banner(){
			new Swiper('.swiper-container', {
				autoplay: true,
			    loop: true, // 循环模式选项
			    disableOnInteraction: false,
			    pagination: {
			      el: '.swiper-pagination',
			    }
			 })
		},
		close: function(){
			this.visite.alert = false;
			this.visite.login = false;
			this.visite.mask = false;
		},
		getPicCodeApi: function(){
			http('get', getPicCodeApi, null, function(res){
				this.picImg = res;
				this.picImgUrl = res.picVerifyUrl +'?'+ res.picId;
			}.bind(this))
		},
		sendSMSCodeApi: function(){
			if(this.isSend) return
			if(!this.login.mobilePhone){
				this.$toast.center('手机号码不能为空');
				return
			}
			if(!this.picVerifyCode){
				this.$toast.center('图形验证码不能为空');
				return
			}
			this.isSend = true
			var time = setInterval(function() {
				while(!this.num--){
					clearInterval(time)
					this.isSend = false
					this.num = 59
				}
			}.bind(this), 1000);
			var data = {
				picId: this.picImg.picId,
				picVerifyCode: this.picVerifyCode,
				flag: "MSG_REG",
				mobilePhone: this.login.mobilePhone
			}
			http('post', sendSMSCodeApi	, data, function(res){
				this.picImgUrl = res.picVerifyUrl +'?'+ res.picId;
			}.bind(this))
		},
		tipIcon: function(){
			this.tipIconSwitch = !this.tipIconSwitch
		},
		submit: function(){
			if(!this.login.mobilePhone){
				this.$toast.center('手机号码不能为空');
				return
			}
			if(!this.picVerifyCode){
				this.$toast.center('图形验证码不能为空');
				return
			}
			if(!this.login.smsCode){
				this.$toast.center('验证码不能为空');
				return
			}
			http('get', regAndLogin	, this.login, function(res){
				this.user = res
				localStorage.user = JSON.stringify(res)
			}.bind(this))
		}
	},
	watch: {
	}
})