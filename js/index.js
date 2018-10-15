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
				iframe: false,
				protocol: false,
				alert: false,
				login: false,
				mask: false,
			},
			protocol: {},
			error: false,
			tipIconSwitch: false,
			picImgUrl: '',
			picImg: {},
			isSend: false,
			picVerifyCode: '',
			link: {
				url: '',
				title: '',
			},
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
	created: function () {
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
			}.bind(this), this)
		},
		linkto: function(item, type){
			if (!this.user.juid) {
				window.scroll(0,0)
				this.visite.protocol = false
				this.visite.iframe = false
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
			http('get', saveJumpRecord, data, function(res){
				if(!res) return
				this.link = item;
				this.visite.iframe = true;
				this.$loading.open('加载中...')
				this.$nextTick(function(){
					this.$refs.iframe.addEventListener('load', function(){
			        	this.$refs.iframe.removeEventListener( "load", arguments.call, false);
						this.$loading.close()
				    }.bind(this), false);
				})
			}.bind(this), this)
			
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
			this.visite.iframe = false;
			this.visite.login = false;
			this.visite.mask = false;
			this.visite.protocol = false;
		},
		getPicCodeApi: function(){
			http('get', getPicCodeApi, null, function(res){
				if(!res) return
				this.picImg = res;
				this.picImgUrl = res.picVerifyUrl +'?picId='+ res.picId;
			}.bind(this), this)
		},
		getProductProtocol: function () {
			http('get', getProductProtocol, {
				protocolType: 1
			}, function(res){
				if(!res) return
				this.visite.mask = true;
				this.visite.protocol = true;
				this.protocol = res;
			}.bind(this), this)
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
			}.bind(this), this)
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
			}.bind(this), this)
		}
	}
})