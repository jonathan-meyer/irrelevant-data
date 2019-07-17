// Get references to page elements
var $lhWrapper = $('#lighthouse-submit');
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
  addUser: function(user){
    $.ajax({
        headers: {
            "Content-Type": "application/json"
        },
        type: "POST",
        url: "/api/user/new",
        data: JSON.stringify(user)
    }).then(function(response){
        console.log(response);

    })
  },
  getUsers: function(email){
    return $.ajax({
        url: "/api/users/" + email,
        type: "GET"
    });
  },
  getUser: function(){
      return $.ajax({
          url: "/auth/user",
          type: "GET"
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

  API.saveExample(lighthouse).then(function(){
    refreshExamples();
    $lhWrapper.modal('hide');
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
    API.getUsers(user.email).then(function(response){
        console.log(response);
        if (response.length === 0){
            $('body').addClass('no-aficionado');
        }
        for (i=0;i<response.length;i++){
            if (user.email === response[i].email && user.token === response[i].token){
                console.log("User matched");
                isUser = true;
                console.log(response[i]);
                $('#username-container').text(`Hello, ${response[i].name}`);
                $('body').addClass('aficionado');
                $('body').removeClass('no-aficionado');
                localStorage.setItem("lighthouseAffUser",JSON.stringify(user));
            } else {
                console.log('user not in database');
                alert("We're sorry, the username or password you entered was incorrect.");
            }
        }
    });
    API.getUser().then(function(response){
        console.log(response);
    })
}

function checkUser(){
    if (localStorage.getItem('lighthouseAffUser')){
        user = JSON.parse(localStorage.getItem('lighthouseAffUser'));
        console.log(localStorage.getItem('lighthouseAffUser'));
        console.log(typeof JSON.parse(localStorage.getItem('lighthouseAffUser')));
        isUserInDatabase(user);
    } else {
        console.log(false);
        $('#username-container').text('');
        $("body").addClass('no-aficionado');
        $('body').removeClass('aficionado');
        return false;
    }
}

function initSlider(target, options){
    $(target).slick(options);
}
// Get lighthouses from database on page load
refreshExamples();
checkUser();
initSlider("#lighthouses", {
    autoplay: true,
    prevArrow: ".prev-wrapper",
    nextArrow: ".next-wrapper",
    slidesToShow: 2,
    infinite: true
});
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
    $('#registration-modal').modal('hide');
    localStorage.setItem("lighthouseAffUser",JSON.stringify(user));
    API.addUser(user);
    console.log(user);
    checkUser();

})

$login.on('submit', function(event){
    event.preventDefault();
    var user = {
        email: $('#email').val().trim(),
        token: $('#password').val().trim()
    }
    isUserInDatabase(user)
    $("#login-modal").modal('hide');

})

// Add event listeners to the submit and delete buttons
$lighthouse.on("submit", function(event){
    console.log('form submitted');
    event.preventDefault();
    handleFormSubmit();
});
$exampleList.on("click", ".delete", handleDeleteBtnClick);

$('#log-out').on('click',function(){
    localStorage.removeItem('lighthouseAffUser');
    checkUser();
})