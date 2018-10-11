new Vue({
	 el: '#app',
	data: function(){
		return {
			visite: {
				alert: false,
				login: true,
				mask: true
			},
			tipIconSwitch: false,
			tipIconUrl: `/images/${this.tipIconSwitch ? 'succ' : 'kong'}.png`,
		}
	},
	created: function (argument) {
	},
	mounted: function(){

	},
	methods: {
		close: function(){
			this.visite.alert = false;
			this.visite.login = false;
			this.visite.mask = false;
		},
		tipIcon: function(){
			this.tipIconSwitch=!this.tipIconSwitch
		}
	}
})