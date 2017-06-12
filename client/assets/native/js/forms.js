$(document).ready(function(){
    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    var myCompanyId = companyData._id;
    var curUser = JSON.parse(localStorage.getItem('currentUser'));

    $('#user-name').text(curUser.first_name + ' ' +  curUser.last_name);
    //command find appts
    var forms = getForms();
    var source = $("#form-list-template").html();
    var template = Handlebars.compile(source);
    var compiledHtml = template(forms);

    $("#form-list").html(compiledHtml);

    $('.closebtn').click(function() {
      console.log("close");
      document.getElementById("notification").style.display='none';
    });

   /***
     * Makes a get request to display list of appts
     * @param none
     * @returns displays the appt list
     */
    function getForms() {
       var json;
       $.ajax({
           dataType: 'json',
           type: 'GET',
           data: $('#response').serialize(),
           async: false,
           url: '/api/form/template/company/' + myCompanyId,
           success: function(response) {
               json = response;
           }
       });
       return json;
   }

    $(document).on('click','.delete-form', function() { 
      var value = confirm("Are you sure you want to delete this form?");
      if(value == true){
        var formId = $(this).closest('.form-row').attr('value');
        $.ajax({
          dataType:'json',
          type: 'DELETE',
          url:'/api/form/template/' + formId,
          success:function(response){
            var updateForms = getForms();
            
            if(updateForms.length < 1){
              window.location.href = "form-builder.html";
            }else{
              $("#form-list").html(template(updateForms));
            }
          }
        });
      }
    });
    
    $(document).on('click','.view-form', function() {
      console.log("write code to take you to google form");
      var formId = $(this).closest('.form-row').attr('value');
      $.ajax({
          dataType:'json',
          type: 'GET',
          url:'/api/form/template/' + formId,
          success:function(response){
            var to_submit = response.properties;
            //define format of form data
            var form_viewer_date = {
              "schema" : {
                "title": response.title,
                "type":"object",
                "properties": response.properties,

              },
              "options": {
                  "form":{
                      "buttons":{
                          "submit":{
                              "click": function() {
                                  //alert(JSON.stringify(to_submit, null, "  "));
                                  var data = this.getValue();
                                  for (var key in data) {
                                    to_submit[key]["value"] = data[key];
                                    if("pattern" in to_submit[key]){
                                      delete to_submit[key].pattern;
                                    }
                                  }
                                  $.ajax({
                                    dataType:'json',
                                    type:'POST',
                                    data:to_submit,
                                    url:'api/form/store',
                                    success:function(response){
                                      console.log(response);
                                      alert("Form successfully Saved!");
                                      modal.style.display = "none";
                                    }
                                  });
                                  // alert(JSON.stringify(to_submit, null, "  "));
                              }
                          }
                      }
                  },
                  "fields" : response.fields
              },
              "view" : "bootstrap-edit"
            };

            console.log(form_viewer_date);
            $("#form-viewer").alpaca(form_viewer_date);
            // Get the modal
            var modal = document.getElementById('myModal');
            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
              modal.style.display = "none";
            }
            //view the modal
            modal.style.display = "block";            
          }
        });

    } );

    $(document).on('click','.add-button', function() {
      window.location.href = "form-builder.html";
    } );

});
