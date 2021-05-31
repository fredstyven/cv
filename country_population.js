$(document).ready(function(){
  var itemarray = [];
  if(localStorage.itemlist){
    console.log("ITEMLIST exists!");
    itemarray = localStorage.itemlist.split(',');
    console.log(itemarray);
    functionOnArray(itemarray, addListelement);
  }

  function functionOnArray(array, myFunction){
    array.map(myFunction);
  }

  function addListelement(listelem, value){
    $("#ul_item").append('<li>' + listelem + ' - ' + value + ' <span><i class="fas fa-times"></i></span></li>');
  }

  //Add country
  $("#add_button").click(function() {
    var elem = $("#list_element").val();
    if(elem == "" || elem == " ")
    alert("Please enter a country!");
    else{
      getPopulation(elem);
    }
  });

  function getPopulation(country) {
    //'https://d6wn6bmjj722w.population.io/1.0/population/Norway/today-and-tomorrow/'
    $.getJSON("https://d6wn6bmjj722w.population.io/1.0/population/" + country + "/today-and-tomorrow/?format=json")
    .done(function(data){
      displaySuccess(data, country);
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
      displayFailure(country);
    });
  }

  function displaySuccess(data, country){
    value = data.total_population[0].population;
    console.log(country + " " + value);
    itemarray.push(country + ' - ' + value);
    localStorage.itemlist = itemarray.toString();
    $("#list_element").val("");
    addListelement(country, value);
  }

  function displayFailure(country){
    alert("Did not find country: '" + country + "'");
    $("#list_element").focus();
  }

  //Delete country
  $("#ul_item").on('click', "i.fa-times", function(e) {
    $(e.target).parents('li').remove();
    itemarray = [];
    $("#ul_item li.i.fa-times").each(function(){
      itemarray.push($(this).text().trim());
    });
    console.log(itemarray.toString());
    itemstring = itemarray.toString();
    localStorage.itemlist = itemstring;
  });

    function searchFor(element, searchWord){
      return element.startsWith(searchWord);
    }

    function upperCase(elem){
      return elem.toUpperCase();
    }

    function getSearchResults(result, searchWord){
      for(i = 0; i < result.length; i++){
        if(searchFor(upperCase(result[i]), upperCase(searchWord))){
          addListelement(result[i]);
        }
      }
}

    var searchitem = document.getElementById('search_item');
    var ul = document.getElementById('ul_item');
    //getSearchResults(itemarray, ""); //initialize list
    searchitem.onkeyup = function (e) {
      while(ul.firstChild){
        ul.removeChild(ul.firstChild);
      }
      getSearchResults(itemarray, searchitem.value);
    };


});
