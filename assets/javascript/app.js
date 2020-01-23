$(document).ready(function () {
    // Initialize Firebase

    //Firebase Key
    var config = {
        apiKey: "AIzaSyCZk78ypU0Sq2nuvXMDEG1J_1tMj-v6pJ8",
        authDomain: "goblins-87011.firebaseapp.com",
        databaseURL: "https://goblins-87011.firebaseio.com",
        projectId: "goblins-87011",
        storageBucket: "goblins-87011.appspot.com",
    };

    //initializing firebase
    firebase.initializeApp(config);
    var database = firebase.database();
    $("#currentTime").text(moment().format('MMMM Do YYYY, h:mm:ss a'));

    // timer 
    var timer = setInterval(updateTime, 1000)
    function updateTime() {
        $("#currentTime").text(moment().format('MMMM Do YYYY, h:mm:ss a'));

        // update the next and minutes for every train

        $(".trains").each(function () {

            var trainTime = moment($(this).attr("first"), "HH:mm:ss")
            var frequency = $(this).attr("freq")

            var minutesAway = frequency - (((moment().diff(trainTime, "minutes")) % frequency))
            var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm A")

            $(this).children(".next").text(nextTrain)
            $(this).children(".min").text(minutesAway)

        })
    }




    $("#submit").on("click", function (event) {
        event.preventDefault();
        var trainObj = {
            trainName: $("#trainName").val(),
            destination: $("#destination").val(),
            trainTime: $("#trainTime").val(),
            frequency: $("#frequency").val()
        }
        console.log(trainObj)
        database.ref().push(trainObj);
        //   clears all text boxes / setting value attributes of elements
        $("#trainName").val("");
        $("#destination").val("");
        $("#trainTime").val("");
        $("#frequency").val("");
    });
    database.ref().on("child_added", function (snapshot) {
        var trainName = snapshot.val().trainName;
        var destination = snapshot.val().destination;
        var frequency = snapshot.val().frequency;

        var trainTime = moment(snapshot.val().trainTime, "HH:mm:ss");   // 08:00:00

        var minutesAway = frequency - (((moment().diff(trainTime, "minutes")) % frequency))

        var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm A")



        var tr = $("<tr class='trains' firt=" + snapshot.val().trainTime + " freq=" + frequency + ">");
        tr.append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td class='next'>").text(nextTrain),
            $("<td class='min'>").text(minutesAway),
        )

        
        $("#tbody").append(tr)

    });
});