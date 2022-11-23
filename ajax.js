/*Event listener that detects clicking on the input submit button
or pressing enter while the input field is active. Activates the getData function.*/
document.getElementById("search").addEventListener("click", getData);
document.getElementById("textfield").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search").click();
    }
});

//Function to get data from the API.
function getData() {
    /*Taking user input. The only validation here is checking for empty input,
    which results in the function not running. */
    var artist = document.getElementById("textfield").value;
    if(artist != ""){
    /*Clearing the html tables every time the function is run to avoid
    the table containing other info than from the desired artist. */
    document.getElementById("table").innerHTML="";
    document.getElementById("table2").innerHTML="";
    document.getElementById("table3").innerHTML="";
    /*All elements are made visible at the start of the function.
    They may become hidden due to missing information, so this is to make 
    sure they will reappear when they are needed again.*/
    document.getElementById("album1").style.display = "block";
    document.getElementById("infoText1").style.display = "block";
    document.getElementById("album2").style.display = "block";
    document.getElementById("infoText2").style.display = "block";
    document.getElementById("album3").style.display = "block";
    document.getElementById("infoText3").style.display = "block";
/*Creating a link for the API based on user input. This API pulls
the top 50 most listened albums of the artist. We use the top 3 for our App.*/
var artistLink = "https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + artist +"&api_key=c28e9e28af72bfb8c1be01255998bde8&format=json";
//Initializing an xmlHttp request.
var xmlHttp = new XMLHttpRequest();
//Textfield is emptied right away for future user input.
document.getElementById("textfield").value="";
//When the state of the XMLHttp request changes, this function is run.
xmlHttp.onreadystatechange = function() {
    //This code is only run if the request was completed.
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        //JSON.parse() turns the data received from the API into an JS object.
        const json = JSON.parse(xmlHttp.responseText);
        //Artist name at the top of the page is pulled from the data.
        document.getElementById("artistName").innerHTML=(json.topalbums.album[0].artist.name);
        /*Pulling the album covers and titles from the data. Elements with missing
        data will be hidden to make the page look nicer.This is repeated for all 3 albums.*/
        //If the album cover and title are missing, both will be hidden.
        if(!json.topalbums.album[0].image[3]['#text'] && json.topalbums.album[0].name == "(null)") {
            document.getElementById("album1").style.display = "none";
            document.getElementById("infoText1").style.display = "none";
        //If only the album cover is missing, hide the cover and display the title.
        } else if(!json.topalbums.album[0].image[3]['#text']) {
            document.getElementById("album1").style.display = "none";
            document.getElementById("infoText1").innerHTML=(json.topalbums.album[0].name);
        } else {
        //If nothing is missing, display normally.
        document.getElementById("album1").src=(json.topalbums.album[0].image[3]['#text']);
        document.getElementById("infoText1").innerHTML=(json.topalbums.album[0].name);
        }
        //Repeat for the second album.
        if(!json.topalbums.album[1].image[3]['#text'] && json.topalbums.album[1].name == "(null)") {
            document.getElementById("album2").style.display = "none";
            document.getElementById("infoText2").style.display = "none";
        } else if(!json.topalbums.album[1].image[3]['#text']) {
            document.getElementById("album2").style.display = "none";
            document.getElementById("infoText2").innerHTML=(json.topalbums.album[1].name);
        } else {
        document.getElementById("album2").src=(json.topalbums.album[1].image[3]['#text']);
        document.getElementById("infoText2").innerHTML=(json.topalbums.album[1].name);
        }
        //Repeat for the third album.
        if(!json.topalbums.album[2].image[3]['#text'] && json.topalbums.album[2].name == "(null)"){
            document.getElementById("album3").style.display = "none";
            document.getElementById("infoText3").style.display = "none";
        } else if(!json.topalbums.album[2].image[3]['#text']) {
            document.getElementById("album3").style.display = "none";
            document.getElementById("infoText3").innerHTML=(json.topalbums.album[2].name);
        } else {
        document.getElementById("album3").src=(json.topalbums.album[2].image[3]['#text']);
        document.getElementById("infoText3").innerHTML=(json.topalbums.album[2].name);
        }
        /*Initializing another XMLHttp request. This request gets the tracklist
        and song lengths from the API. Repeated for all of the three albums. */
        //Using the artist name and album title from out previous search.
        var artist2 = json.topalbums.album[0].artist.name;
        var albumName = json.topalbums.album[0].name;
        var albumLink = "https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=c28e9e28af72bfb8c1be01255998bde8&artist=" + artist2 + "&album=" + albumName + "&format=json";
var xmlHttp2 = new XMLHttpRequest();
xmlHttp2.onreadystatechange = function() {
    if (xmlHttp2.readyState == 4 && xmlHttp2.status == 200) {
        const json2 = JSON.parse(xmlHttp2.responseText);
        //If both the tracklist and album cover are missing, album title wil be hidden.
        if(!json2.album.tracks && !json.topalbums.album[0].image[3]['#text']){
            document.getElementById("infoText1").style.display = "none";
        } else {
        //Using a for-loop to make a table including the tracklist.
        var i;
        for(i= 0; i < json2.album.tracks.track.length; i++) {
            var trackLength = json2.album.tracks.track[i].duration;
            var row = document.getElementById("table").insertRow(i);
                var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(1);
                var cell2 = row.insertCell(2);
                /*cell0 contains the track number.
                cell1 contains the track name.
                Cell2 contains the track length. */
                cell0.innerHTML = i+1+".";
                cell1.innerHTML = json2.album.tracks.track[i].name;
                //If song length is not available, displays 'N/A'
                if(!trackLength){
                    cell2.innerHTML="N/A";
                }
                /*Song lengths are displayed only in seconds in the data, and we
                want it to be displayed in minutes and seconds.
                Math.floor() rounds down to the nearest integer.*/
                else if(trackLength%60 < 10) {
                cell2.innerHTML = Math.floor(trackLength/60) + ":0" + Math.floor(trackLength%60);
                } else {
                    cell2.innerHTML = Math.floor(trackLength/60) + ":" + Math.floor(trackLength%60);
                }
        } 
    }
    }
};
//Sending the request.
xmlHttp2.open("GET", albumLink, true);
xmlHttp2.send();
//Same process is repeated for the second album.
    var artist3 = json.topalbums.album[0].artist.name;
    var albumName2 = json.topalbums.album[1].name;
    var albumLink2 = "https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=c28e9e28af72bfb8c1be01255998bde8&artist=" + artist3 + "&album=" + albumName2 + "&format=json";
    var xmlHttp3 = new XMLHttpRequest();
    xmlHttp3.onreadystatechange = function() {
    if (xmlHttp3.readyState == 4 && xmlHttp3.status == 200) {
        const json3 = JSON.parse(xmlHttp3.responseText);
        if(!json3.album.tracks && !json.topalbums.album[1].image[3]['#text']){
            document.getElementById("infoText2").style.display = "none";
        } else {

        var i;
        for(i= 0; i < json3.album.tracks.track.length; i++) {
            var trackLength = json3.album.tracks.track[i].duration;
            var row = document.getElementById("table2").insertRow(i);
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            cell0.innerHTML = i+1+".";
            cell1.innerHTML = json3.album.tracks.track[i].name;
            if(!trackLength){
                cell2.innerHTML="N/A";
            }
            else if(trackLength%60 < 10) {
            cell2.innerHTML = Math.floor(trackLength/60) + ":0" + Math.floor(trackLength%60);
            } else {
                cell2.innerHTML = Math.floor(trackLength/60) + ":" + Math.floor(trackLength%60);
            }
        }
    }
    }
};
xmlHttp3.open("GET", albumLink2, true);
xmlHttp3.send();
//Same process is repeated for the third album.
    var artist4 = json.topalbums.album[0].artist.name;
    var albumName3 = json.topalbums.album[2].name;
    var albumLink3 = "https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=c28e9e28af72bfb8c1be01255998bde8&artist=" + artist4 + "&album=" + albumName3 + "&format=json";
    var xmlHttp4 = new XMLHttpRequest();
    xmlHttp4.onreadystatechange = function() {
    if (xmlHttp4.readyState == 4 && xmlHttp4.status == 200) {
        const json4 = JSON.parse(xmlHttp4.responseText);
        if(!json4.album.tracks && !json.topalbums.album[2].image[3]['#text']){
            document.getElementById("infoText3").style.display = "none";
        } else {
            
        var i;
        for(i= 0; i < json4.album.tracks.track.length; i++) {
            var trackLength = json4.album.tracks.track[i].duration;
            var row = document.getElementById("table3").insertRow(i);
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            cell0.innerHTML = i+1+".";
            cell1.innerHTML = json4.album.tracks.track[i].name;
            if(!trackLength){
                cell2.innerHTML="N/A";
            }
            else if(trackLength%60 < 10) {
            cell2.innerHTML = Math.floor(trackLength/60) + ":0" + Math.floor(trackLength%60);
            } else {
                cell2.innerHTML = Math.floor(trackLength/60) + ":" + Math.floor(trackLength%60);
            }
        } 
    }
    }
};
xmlHttp4.open("GET", albumLink3, true);
xmlHttp4.send(); 

    }
};
xmlHttp.open("GET", artistLink, true);
xmlHttp.send();

}
}