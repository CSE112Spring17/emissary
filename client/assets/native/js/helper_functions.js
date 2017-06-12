/***
 * Makes a get request to display list of appts
 * @param none
 * @returns displays the appt list
 */
function openFormHelper() {
  var companyData = JSON.parse(localStorage.getItem("currentCompany"));
  var myCompanyId = companyData._id;
  console.error("companyid is: " + myCompanyId);
   var json;
   $.ajax({
       dataType: 'json',
       type: 'GET',
       data: $('#response').serialize(),
       async: false,
       url: '/api/form/template/company/' + myCompanyId,
       success: function(response) {
        if(response.length == 0){
          console.log("no forms, serving form-builder.html");
          window.location.href = "form-builder.html";
        }else{
          console.log("forms exist, serving forms.html");
          window.location.href = "forms.html";
        }
       }
   });
}