
module.exports = {
	
	production : {
		db : 	'mongodb://localhost/scia',
		stripe_key : "sk_live_wFzMrMjE1CFbZCoCEsW4hw8m",
		app : {
			name: 'uscscia.com'
		}
	},
	
	test : {
		db : 'mongodb://localhost/test',
		stripe_key : "sk_test_Y60ywef6DTEeL2cwLTIULoxT",
		app: {
			name : 'uscscia.com'
		}
	}

}