module.exports = {
	'E2E Emissary Testing': function(client){
		client
			.url('http://http://35.185.226.210/')
			.useXpath()
			//.click("//a[text()='Log In']")
			.click("")
			.useCss()
			.waitForElementVisible('body',1000)
			.assert.visible('input[name=email]')
			.setValue('input[name=email]', 'peter@enque.com')
			.assert.visible('input[name=password]')
			.setValue('input[name=password]', 'peter')
			.click('button[type=submit]')
			.pause(3000)
			.assert.title('Express')
			.end();
	}
};