// Get references to page elements
var $lhWrapper = $("#lighthouse-submit");
var $lighthouse = $("#new-lighthouse");
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
var $lighthouses = $("#lighthouses");
var $login = $("#login-form");
var $register = $("#registration-form");
var editButton = $('#edit');
var noEdit = $('#no-edit');

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    console.log("API.saveExample() running");
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/lighthouses",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "/api/lighthouses",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "/api/lighthouses/" + id,
      type: "DELETE"
    });
  },
  addUser: function(user) {
    $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/user/new",
      data: JSON.stringify(user)
    }).then(function(response) {
      console.log(response);
    });
  },
  getUsers: function(email) {
    return $.ajax({
      url: "/api/users/" + email,
      type: "GET"
    });
  },
  getUser: function() {
    return $.ajax({
      url: "/auth/user",
      type: "GET"
    });
  },
  logOut: function(){
      return $.ajax({
          url: "/auth/logout",
          type: "GET"
      })
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  if ($("#lighthouses.slick-slider").length) {
    initSlider("#lighthouses", "unslick");
    console.log("#lighthouses unslicked");
  }
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $title = $("<h2>")
        .text(example.name)
        .attr("href", "/lighthouse/" + example.id)
        .attr("class", "text-center lh-title");
      var $lhImage = $("<img>")
        .attr("src", example.image)
        .addClass("card-img-top img-thumbnail")
        .attr("alt", example.name);
      var $lhDesc = $("<p>")
        .attr("class", "lh-desc text-center")
        .text(example.description);
      var yearBuilt = $("<li>")
        .attr("class", "lh-spec year-built")
        .text("Year built: " + example.yearBuilt);
      var serviceYearStart = $("<li>")
        .attr("class", "lh-spec service-start")
        .text("First year in service: " + example.serviceYearStart);
      var serviceYearEnd = $("<li>")
        .attr("class", "lh-spec service-end")
        .text("Year decommissioned: " + example.serviceYearEnd);
      var height = $("<li>")
        .attr("class", "lh-spec height")
        .text("Height: " + example.height + "ft.");
      var state = $("<li>")
        .attr("class", "lh-spec state")
        .text("State/Country: " + example.locationState);
      var specs = $("<ul>")
        .attr("class", "specs")
        .append(state)
        .append(height)
        .append(yearBuilt)
        .append(serviceYearStart)
        .append(serviceYearEnd);
      var favorite = $('<div>')
        .attr('class','favorite')
        .attr('title','Add to favorites list')
        .html("<i class='far fa-plus-square'></i>");
      var $card = $("<div>")
        .attr({
          class: "card",
          "data-id": example.id
        })
        .append($lhImage)
        .append($title)
        .append($lhDesc)
        .append(specs)
        .append(favorite);
      
      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");
      var $cardWrapper = $("<a>");
      $card.append($button);
      $cardWrapper.append($card);

      
      return $card;
    });

    $lighthouses.empty();
    $lighthouses.append($examples);
    setTimeout(function(){
        $('.card').matchHeight();
    }, 100)
    initSlider("#lighthouses", {
      autoplay: false,
      prevArrow: ".prev-wrapper",
      nextArrow: ".next-wrapper",
      slidesToShow: 3,
      infinite: true,
      adaptiveHeight: true,
      responsive: [
          {
              breakpoint: 768,
              settings: {
                  slidesToShow: 1
              }
          },
          {
              breakpoint: 980,
              settings: {
                  slidesToShow: 2
              }
          }
      ]
    });
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function() {
  console.log("form submitted");

  // var example = {
  //   text: "test",
  //   description: "description"
  // };

  if ($("#in-service input[name='in-service']").val() === "yes") {
    var inService = true;
  } else {
    var inService = false;
  }
  var lighthouse = {
    name: $("#name")
      .val()
      .trim(),
    description: $("#description")
      .val()
      .trim(),
    locationStreet: $("#street")
      .val()
      .trim(),
    locationCity: $("#city")
      .val()
      .trim(),
    locationState: $("#state")
      .val()
      .trim(),
    locationPostalCode: parseInt(
      $("#zip")
        .val()
        .trim()
    ),
    height: parseFloat($("#height").val()),
    yearBuilt: parseInt(
      $("#year-built")
        .val()
        .trim()
    ),
    inService,
    serviceYearStart: parseInt(
      $("#service-start")
        .val()
        .trim()
    ),
    serviceYearEnd: parseInt(
      $("#service-end")
        .val()
        .trim()
    ),
    image: $("#picture")
      .val()
      .trim(),
    locationLatitude: parseInt(
      $("#lat")
        .val()
        .trim()
    ),
    locationLongitude: parseInt(
      $("#long")
        .val()
        .trim()
    )
  };

  API.saveExample(lighthouse).then(function() {
    refreshExamples();
    $lhWrapper.modal("hide");
  });
};

// handleDeleteBtnClick is called when an example's delete button is clicked

// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

function isUserInDatabase(user){
    console.log('running isUserInDatabase()');
    API.getUser().then(function(response){
        console.log(response);
        $('body').addClass('aficionado').removeClass('no-aficionado');
        if (response.role === 'admin'){
            $('body').addClass('admin');j
        }
    }).catch(function(err){
        if (err){
            console.log(err);
            $('body').addClass('no-aficionado').removeClass('aficionado');
        }
    });
                
}

function checkFaveList(user){
    API.getUserLists(user).then(function(response){
        if (response.length === 0){
            console.log('no favorite lists');
        } else {
            // do something with the favorites list
        }
    })
}

function initSlider(target, options) {
  $(target).slick(options);
}
// Get lighthouses from database on page load
refreshExamples();
// checkUser();
isUserInDatabase();

// Add event listeners to the register/login forms
$register.on("submit", function(event) {
  event.preventDefault();
  if (
    $("#reg-conf-password")
      .val()
      .trim() !==
    $("#reg-password")
      .val()
      .trim()
  ) {
    return alert("Passwords must match");
  }
  var user = {
    name: $("#reg-name")
      .val()
      .trim(),
    email: $("#reg-email")
      .val()
      .trim(),
    token: $("#reg-password")
      .val()
      .trim()
  };
  $("#registration-modal").modal("hide");
  localStorage.setItem("lighthouseAffUser", JSON.stringify(user));
  API.addUser(user);
  console.log(user);
  checkUser();
});

editButton.on('click',function(){
    $('body').addClass('edit-mode');
    editButton.hide();
    noEdit.show();
});
noEdit.on('click',function(){
    $('body').removeClass('edit-mode');
    editButton.show();
    noEdit.hide();
});

$login.on("submit", function(event) {
  event.preventDefault();
  var user = {
    email: $("#email")
      .val()
      .trim(),
    token: $("#password")
      .val()
      .trim()
  };
  isUserInDatabase(user);
  $("#login-modal").modal("hide");
});

// Add event listeners to the submit and delete buttons
$lighthouse.on("submit", function(event) {
  console.log("form submitted");
  event.preventDefault();
  handleFormSubmit();
});
$lighthouses.on("click", ".delete", handleDeleteBtnClick);

$('#lighthouse-wrapper').on('click','.card .favorite i', function(){
    // code to add a favorite to personal list
    console.log($(this));
    let id = $(this).get(0).dataset.id;
    // Create a favorites list if not already a list fot this user/return list
    // Add item to lighthouse favorites list
});


