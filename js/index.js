new Vue({
	 el: '#app',
	data: function(){
		return {
			user: localStorage.user 
			? JSON.parse(localStorage.user )
			: {juid:''},
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
			error: false,
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
				if(!res) {
					this.error = true
					return
				}
				this.home = res;
				if (this.home.popupsList.length) {
					this.visite.mask = true
					this.visite.alert = true
				}
				if(!this.home.banerList.length && !this.home.hotRecoList.length && !this.home.productList.length){
					this.error = true
					return
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
				juid: this.user.juid,
				token: this.user.token,
				productId: item.productId || '',
				position: type,
				from: 1,
				linkUrl: item.linkUrl
			}
			http('get', getHomeInfoApi, data, function(){
				location.href = item.linkUrl;
			})
			
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
				if(!res) return
				this.picImg = res;
				this.picImgUrl = res.picVerifyUrl +'?picId='+ res.picId;
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
				if(!res) return
				this.$toast.center('验证码发送成功');
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
			if(!this.tipIconSwitch){
				this.$toast.center('请阅读协议并勾选');
				return
			}
			http('get', regAndLogin	, this.login, function(res){
				if(!res) return
				this.user = res
				localStorage.user = JSON.stringify(res)
				this.visite.login = false;
			}.bind(this))
		}
	},
	watch: {
	}
})