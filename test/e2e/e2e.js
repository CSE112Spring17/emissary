module.exports = {
	'E2E Emissary Testing': function(client){
		client
			.url('http://35.185.226.210')
			.waitForElementVisible('body',1000)
			.assert.title('OMNI')
			.assert.attributeContains('a','href','http://35.185.226.210/index.html')
			.assert.attributeContains('nav','class','site-nav')
			.pause(1000)

			//testing sign up page
			/*.click("div.callout-button")
			.pause(3000)
			.assert.attributeContains('body','id',"sign-up-body")
			.assert.visible('input[name=name]')
			.setValue('input[name=name]','666666')
			.assert.visible('input[name=email]')
			.setValue('input[name=email]','testing6666@test.com')
			.assert.visible('input[name=phone_number]')
			.setValue('input[name=phone_number]','8880008888')
			.pause(2000)

			.assert.visible('button[id=submit-company-btn]')
			.click('button[id=submit-company-btn]')
			.pause(2000)

			.assert.visible('input[name=first]')
			.setValue('input[name=first]','testFirst')

			.assert.visible('input[name=last]')
			.setValue('input[name=last]','testLast')

			.assert.visible('input[id=form-employee-email]')
			.setValue('input[id=form-employee-email]','testing6666@test.com')

			.assert.visible('input[id=form-employee-phone]')
			.setValue('input[id=form-employee-phone]','8888888888')

			.assert.visible('input[name=form-password]')
			.setValue('input[name=form-password]','12345678')

			.assert.visible('input[name=form-repeat-password]')
			.setValue('input[name=form-repeat-password]','12345678')
			.pause(2000)

			.click('button[id=submit-btn]')
			.waitForElementVisible('body',1000)
			.pause(2000)
			.assert.title('Emissary | Dashboard')
			.pause(1000)
			.assert.visible("div[id=calendar]")
			.pause(3000)*/
			//finish testing signing up

			.url('http://35.185.226.210/login.html')
			.waitForElementVisible('body',1000)
			.assert.title('Emissary | Login')
			.pause(2000)

			.assert.visible("input#username.form-control")//'input[id=username]')
			.setValue("input#username.form-control",'testing@test.com')
			.assert.visible("input#password.form-control")//'input[id=password]')
			.setValue("input#password.form-control",'1234567')
			.click('button[id=loginButton]')
			.pause(1000)
			.assert.visible("div#errorlog.error")
			.pause(2000)

			.assert.visible("input#username.form-control")
			.clearValue("input#username.form-control")
			.pause(500)
			.setValue("input#username.form-control",'testing666@test.com')
			.assert.visible("input#password.form-control")
			.clearValue("input#password.form-control")
			.pause(500)
			.setValue("input#password.form-control",'12345678')
			.assert.visible('button[id=loginButton]')
			.click('button[id=loginButton]')
			.pause(2000)

			.waitForElementVisible('body',2000)
		
			// Test if the calendar is in the Dashboard
			.assert.title('Emissary | Dashboard')
			.assert.visible('div[id=calendar]')
			.pause(2000)
		

			.url("http://35.185.226.210/visitors.html")
			.assert.title('Emissary | Visitors')
			.assert.visible("div#visitor-queue")
			.pause(1000)
		
			// test check-in button
			// shoud work after merge and push to master
			.assert.visible("div.checkin-button")
			.click("div.checkin-button")
			.pause(2000)
			.assert.visible("div#override_checkin_modal-dialog")
			.pause(1000)
			.setValue("input#visitor-first.visitor-fields","testFirst")
			.setValue("input#visitor-last.visitor-fields","testLast")
			.setValue("input#visitor-number.visitor-fields","000-000-0000")
			.pause(1000)
			.click('input#override_checkin_submit-check-in.submit-check-in')
			.assert.visible("tbody#visitor-list")
			.pause(1000)
			.click("tr.patient-check-out")
			.pause(1000)
			.assert.visible("div#myModal.modal.fade.in")
			.pause(500)
			//.assert.visible("button.check-in-btn.btn.btn-default.remove-btn")
			//.click("button.check-in-btn.btn.btn-default.remove-btn")
			.pause(2000)
			.waitForElementVisible('body',2000)
			.assert.title('Emissary | Visitors')

		
			.url("http://35.185.226.210/employees.html")
			.assert.visible("div.employee-container")
			.pause(2000)

			.url("http://35.185.226.210/appointments.html")
			.assert.visible("div.add-button")
			.click("div.add-button")
			.pause(2000)
			.assert.visible("div#myModal.modal.fade.in")
			.pause(1000)
			.setValue("input#appt-first.form-control","sfaser")
			.setValue("input#appt-last.form-control","asdfsa")
			.setValue("input#appt-email","testing666@test.com")
			.setValue("input#appt-number","1111111111")
			.setValue("input#appt-provider","wrsadfa")
			.setValue("input#appt-date","12/31")
			.setValue("input#appt-time","4")
			.pause(2000)
			.click("button.check-in-btn.btn.btn-default.save-btn")
			.pause(1000)
			.assert.visible("li.appt-navbar_li")
			.assert.visible("a.appt-navbar_a")
			.url("http://35.185.226.210/appointment_history")
			.pause(2000)
			.assert.visible("tbody#appt-list")
			.assert.visible("td.appt-data")
			.pause(2000)

			.url("http://35.185.226.210/form-builder.html")
			.assert.visible("div#fb-editor")
			.click("li.icon-autocomplete.input-control.input-control-0.ui-sortable-handle")
			.click("li.icon-paragraph.input-control.input-control-3.ui-sortable-handle")
			.click("li.icon-radio-group.input-control.input-control-7.ui-sortable-handle")
			.click("li.icon-text.input-control.input-control-9.ui-sortable-handle")
			.pause(2000)

			.url("http://35.185.226.210/settings.html")
			.assert.visible("div.main-content")
			.pause(2000)

			//test logout button
			.assert.visible("a#logoutButton_side")
			.click('a[id=logoutButton_side]')
			.pause(2000)
			.waitForElementVisible('body',1000)
			.assert.title('OMNI')
			.end();
	}
};
