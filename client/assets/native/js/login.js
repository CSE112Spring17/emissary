// with Button named loginButton
$(function() {
   $('#loginButton').click(function () {
       var userData = grabUserData();
       //alert(userData);
       event.preventDefault();
       ajaxPostUser('/api/employees/login', userData);
       
   });
});


// with Button named signin-bt
$(function() {
   $('#logoutButton').click(function() {
       localStorage.removeItem('userState');
       localStorage.removeItem('currentUser');
       localStorage.removeItem('currentCompany');
   });
});

//Ajax function to create a POST request to server
   /***
     * Ajax function to create a POST request to server
     * @param url, data
     * @returns none
     */
function ajaxPostUser(url, data){
   $.ajax({
       type: "POST",
       url: url,
       data: data,
       dataType: 'json',
       success: function(response){
           console.log(response);
           if(response.role == 'a_admin'){
             localStorage.setItem('userState' , 2);
             location.href = '/admin-dashboard.html'
           }
           else{
             localStorage.setItem('userState' , 1);
             localStorage.setItem('currentUser', JSON.stringify(response));
             ajaxGetCompanyInfo('/api/companies/' + response.company_id);
             location.href = '/visitors.html';
         }
       },
       error: function() {

           window.onerror=handleError();
           event.preventDefault();
           //location.href = '/login.html';
        }
   });
}
// ex) company_id : 56e8a51293a19986040e93fe
//Ajax function to create a POST request to server
   /***
     * Ajax function to create a POST request to server
     * @param a url
     * @returns a JSON contains the company's information
     */
function ajaxGetCompanyInfo(url){
   $.ajax({
       type: "GET",
       url: url,
       data: $('#response').serialize(),
       async: false,
       dataType: 'json',
       success: function(response){
           console.log(response);
           //alert(response.name);
           localStorage.setItem('currentCompany', JSON.stringify(response));
       }
   });
}

   /***
     * Retrieve user data
     * @param none
     * @returns a JSON contains user's email and password
     */
function grabUserData(){
   var user = {};
   user.email = $('#username').val();
   user.password = $('#password').val();
   return user;
}


   /***
     * Uses to handle errors
     * @param none
     * @returns boolean of if error handled
     */
function handleError()
{
   errorlog.innerHTML="Not Valid Username and Password, please type valid one.";
   return true;
}