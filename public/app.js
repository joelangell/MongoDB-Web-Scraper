$(document).ready(function() {
  $(document).on("click", "#scrape-btn", function(event) {
    event.preventDefault();

    $.getJSON("/reviews", function(data) {
      for (var i = 0; i < 6; i++) {
        //   console.log(data);
        $("#results-div").append(
          `<div class="col-sm-2">
                  <div class="card text-white bg-dark">
                          <a href = "${
                            data[i].link
                          }"><img class="card-img-top" src="${
            data[i].img
          }" alt="Card image cap"></a>
                      <div class="card-body">
                          <h5 class="card-title" id= "card-title-${i}">${
            data[i].artist
          }</h5>
                          <p class="card-text">${data[i].title}</p>
                          <small class="text-muted">${data[i].genre}</small>
                      </div>
                      <div class="card-footer-${i}">
                          <button class="btn btn-outline-danger comment-btn" type="button" data-toggle="modal" id= "${
                            data[i]._id
                          }" data-target="#commentModal${i}" value = ${i}>Comment</button>
                      </div>
                  </div>
              </div>
              <div class="modal fade" id="commentModal${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                      <div class="modal-content">
                          <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLabel">${
                                data[i].title
                              }</h5>
                              <button type="button" class="close close-btn" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                              </button>
                          </div>
                          <div class="modal-body">
                              
                              <form>
                                  <div class="form-group">
                                      <label for="exampleFormControlTextarea1">What did you think of this album?</label>
                                      <textarea class="form-control" id="exampleFormControlTextarea${i}" rows="3"></textarea>
                                  </div>
                              </form>
                              <ul class="list-group" id="comment-list-${i}">Recent Comments
                                  
                              </ul>
                          </div>
                          <div class="modal-footer">
                              <button type="button" class="btn btn-secondary close-btn" data-dismiss="modal">Close</button>
                              <button type="button" class="btn btn-primary add-btn" id= "${
                                data[i]._id
                              }" value = ${i}>Add Comment</button>
                          </div>
                      </div>
                  </div>
              </div>
                `
        );
      }
    });
  })  

  $(document).on("click", ".add-btn", function(event) {
    event.preventDefault();
    var scrapeID = $(this).attr("id");
    var id = $(this).val();
    var commentInput = $("#exampleFormControlTextarea" + id)
      .val()
      .trim();
    var userComment = {
      comment: commentInput,
      is_deleted: false,
      review_id: scrapeID
    };
    $.post("/comments/new", userComment)
      .then(function(data) {})
      .then(function(res) {});
    console.log(userComment);
    $("#comment-list-" + id).append(
      `<a href="#" class="list-group-item list-group-item-action">${
        userComment.comment
      }</a>`
    );
    $("#exampleFormControlTextarea" + id).val("");
  });

  $(document).on("click", ".comment-btn", function(event) {
    event.preventDefault();
    var scrapeID = $(this).attr("id");
    var id = $(this).val();
    $.getJSON("/reviews/" + scrapeID, function(data) {
      var length = data.comment.length;
      for (i = 0; i < length; i++) {
        $("#comment-list-" + id).append(
          `<a href="#" class="list-group-item list-group-item-action" id = "${
            data.comment[i]._id
          }">${data.comment[i].comment}</a>`
        );
      }
    });
  });
});

$(document).on("click", ".close-btn", function(event) {
  event.preventDefault();
  $(".list-group").empty();
});

$(document).on("click", ".list-group-item", function(event) {
  event.preventDefault();
  var commentID = $(this).attr("id");
  console.log(commentID);
  $.ajax({
    url: "/comments/" + commentID,
    type: "DELETE",
    success: function(data) {
      console.log(data);
    }
  });
});
