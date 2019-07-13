// Get references to page elements
var $lighthouse = $('#new-lighthouse');
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");
var $login = $('#login-form');
var $register = $('#registration-form');


// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
      console.log('API.saveExample() running');
    $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/examples",
      data: JSON.stringify(example)
    }).then(function(){
        refreshExamples();
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "/api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "/api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.name)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function() {
    console.log('form submitted');

  var example = {
    text: "test",
    description: "description"
  };
  if ($("#in-service input[name='in-service']").val() === "yes"){
      var inService = true;
  } else {
      var inService = false;
  }
  var lighthouse = {
      name: $('#name').val().trim(),
      description: $('#description').val().trim(),
      locationStreet: $('#street').val().trim(),
      locationCity: $('#city').val().trim(),
      locationState: $('#state').val().trim(),
      locationPostalCode: parseInt($('#zip').val().trim()),
      height: parseFloat($('#height').val()),
      yearBuilt: parseInt($('#year-built').val().trim()),
      inService,
      serviceYearStart: parseInt($('#service-start').val().trim()),
      serviceYearEnd: parseInt($('#service-end').val().trim()),
      image: $("#picture").val().trim(),
      locationLatitude: parseInt($("#lat").val().trim()),
      locationLongitude: parseInt($('#long').val().trim())
  }

  API.saveExample(lighthouse);

  $exampleText.val("");
  $exampleDescription.val("");
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

var createUser = function(user) {
    localStorage.setItem("lighthouseAffUser",JSON.stringify(user));
    
}

// Get lighthouses from database on page load
refreshExamples();

// Add event listeners to the register/login forms
$register.on('submit', function(event){
    event.preventDefault();
    if ($("#reg-conf-password").val().trim() !== $("#reg-password").val().trim()){
        return alert ("Passwords must match");
    }
    var user = {
        name: $('#reg-name').val().trim(),
        email: $('#reg-email').val().trim(),
        token: $('#reg-password').val().trim()
    }
    console.log(user);
})

// Add event listeners to the submit and delete buttons
$lighthouse.on("submit", function(event){
    console.log('form submitted');
    event.preventDefault();
    handleFormSubmit();
});
$exampleList.on("click", ".delete", handleDeleteBtnClick);
