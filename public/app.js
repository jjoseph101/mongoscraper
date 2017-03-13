// GRAB ARTICLES
$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// ON ARTICLE CLICK
$(document).on("click", "p", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  // GET ARTICLE
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

// SAVING NOTE
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  // CHANGE NOTE
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  // REMOVE VALUES RE NOTE ENTRY
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
