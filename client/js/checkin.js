$(document).ready(function(){

    var socket = io('/visitorList');
    var VALIDATE_COMPANY_ID = "validate_company_id";
    var ADD_VISITOR = "add_visitor";

    //Prevent users from scrolling around on iPad
    document.ontouchmove = function(e) {
        e.preventDefault();
    };

    socket.emit(VALIDATE_COMPANY_ID, 'uniqueId');

    //Bind Listeners
    $('#tap-to-check').on('click', startCheckIn);
    $('.check-in').on('submit',function(event){
        event.preventDefault();
        var data = grabFormElements();
        console.log("data: " + data);
        socket.emit('ADD_VISITOR', {room: 'uniqueId'}, data);

        $(this).animate({
            top:'35%',
            opacity:'0'
        },0);



    });

    //When a user starts their check in
    function startCheckIn(){
        console.log("click");
        $('.check-in').addClass('show');
        $('.check-in').animate({
            top:'25%',
            opacity: '1'
        }, 700);
        $(this).addClass('hide');
        $('#clock').addClass('hide');
    }

    //When a patient submits their form
    function submitForm(){
        var data = grabFormElements();
        console.log("data: " + data);
        io.to('uniqueId').emit('ADD_VISITOR', data);

        $(this).animate({
            top:'35%',
            opacity:'0'
        },0);

    }

    //Grabs elements from the check in and puts it into an object
    function grabFormElements(){
        var newVisitor = {};
        newVisitor.firstName= $('#visitor-first').val();
        newVisitor.lastName = $('#visitor-last').val();
        newVisitor.phoneNumber = $('#visitor-number').val();
        newVisitor.checkin = getCurrentTime();
        return newVisitor;
    }

    //Function to get Current Time of Check in
    function getCurrentTime(){
        var currentTime;
        var today = new Date();
        var currentHour = today.getHours();
        var currentMinute = today.getMinutes();

        if(currentMinute < 10){
            currentMinute = '0' + currentMinute;
        }

        if(currentHour >= 13){
            currentHour = currentHour - 12;
            currentTime = currentHour + ':' + currentMinute + 'PM';
        }
        else if(currentHour === 12){
            currentTime = currentHour + ':' + currentMinute + 'PM';
        }
        else if (currentHour === 0)
            currentTime = 1 + ':' + currentMinute + 'AM';
        else
            currentTime = currentHour + ':' + currentMinute + 'AM';

        return currentTime;

    }

    //CLOCK
    function updateClock () {
        var currentTime = new Date ( );
        var currentHours = currentTime.getHours ( );
        var currentMinutes = currentTime.getMinutes ( );
        //var currentSeconds = currentTime.getSeconds ( );

        // Pad the minutes and seconds with leading zeros, if required
        currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
        //currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;


        // Convert the hours component to 12-hour format if needed
        currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

        // Convert an hours component of "0" to "12"
        currentHours = ( currentHours == 0 ) ? 12 : currentHours;

        // Compose the string for display
        var currentTimeString = currentHours + ":" + currentMinutes;

        $("#clock").html(currentTimeString);
    }
    updateClock();
    setInterval(updateClock, 60 * 1000);


});
