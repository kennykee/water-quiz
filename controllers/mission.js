var frame_width = 1280; /* Standard width */
var frame_height = 800; /* Standard height */
var ratio = 1; /* Current ratio */
var idle_second = 300;
var current_idle = 0;
var current_function = "";
var toastTimer;
var score_rate = [5, 10, 15, 20]; /* Score for each stage. */
var min_correct_per_stage = [2, 2, 2, 2];
var min_perfect_score = 150;
var answer_index = ["A", "B", "C", "D", "E", "F"];
var stage_role_name = [
  "Water Novice",
  "Water Learner",
  "Water Consultant",
  "Water Specialist",
];
var current_stage_index = 0;
var current_question_index = 0;
var current_question_set = [];
var current_score = 0;
var current_stage_correct_count = 0;

function init_app() {
  $(function () {
    calculateRatio();

    /* Transform scale for different screen resolution. */
    $("#container").css("transform", "scale(" + ratio + ")");

    init_idle_timeout();
    init_home_page();
  });
}

function init_home_page() {
  clearPage();
  clearTimer();
  changeBackground("./assets/images/Background-Intro.png");
  current_function = "init_home_page";

  /* Background white transparency */
  var obj = $("<div class='white-background'></div>");
  $("#page-container").append(obj);

  /* Intro Frame */
  var r = new Array(),
    j = -1;
  r[++j] = "<div class='intro-frame-container'>";
  r[++j] =
    "<div class='turn-next-page-label'><img class='tile-thumbnail' src='./assets/images/Turn-To-Next-Page-Button.png'/></div>";
  r[++j] =
    "<div class='intro-frame'><img class='tile-thumbnail' src='./assets/images/Intro-Frame.png'/></div>";
  r[++j] =
    "<div class='pipe-round' data-page='1'><img class='tile-thumbnail' src='./assets/images/Pipe-Round-Valve.png'/></div>";
  r[++j] =
    "<div class='intro-text-one'><img class='tile-thumbnail' src='./assets/images/Intro-Text-One.png'/></div>";
  r[++j] = "</div>";

  var obj = $(r.join(""));

  $("#page-container").append(obj);

  $(".pipe-round").click(function (event) {
    $(this).addClass("pipe-rotate");

    setTimeout(function () {
      $(".pipe-round").removeClass("pipe-rotate");
    }, 800);

    switch ($(this).data("page")) {
      case 1:
        $(this).data("page", 2);
        $(".intro-text-one")
          .css("opacity", 1)
          .css("animation", "400ms linear 100ms fade-out-animation forwards");
        $(".intro-frame-container").append(
          "<div class='intro-text-two'><img class='tile-thumbnail' src='./assets/images/Intro-Text-Two.png'/></div>"
        );
        $(".turn-next-page-label").css("opacity", 1).css("animation", "none");

        /* White Layer */
        $(".white-background").delay(100).fadeIn(400);

        /* Bottom Stages Panel */
        var r = new Array(),
          j = -1;
        r[++j] = "<div class='bottom-stages-container'>";
        r[++j] =
          "<div class='lady-popup'><img class='tile-thumbnail' src='./assets/images/Lady.png'/></div>";
        r[++j] =
          "<div class='bottom-stages-background'><img class='tile-thumbnail' src='./assets/images/Bottom-Stages-Container.png'/></div>";
        r[++j] =
          "<div class='stage-1-label'><img class='tile-thumbnail' src='./assets/images/Stage-One.png'/></div>";
        r[++j] =
          "<div class='stage-2-label'><img class='tile-thumbnail' src='./assets/images/Stage-Two.png'/></div>";
        r[++j] =
          "<div class='stage-3-label'><img class='tile-thumbnail' src='./assets/images/Stage-Three.png'/></div>";
        r[++j] =
          "<div class='stage-4-label'><img class='tile-thumbnail' src='./assets/images/Stage-Four.png'/></div>";
        r[++j] = "</div>";

        var obj = $(r.join(""));

        $("#page-container").append(obj);

        break;
      case 2:
        $(this).data("page", 3);
        $(".intro-text-two")
          .css("opacity", 1)
          .css("animation", "400ms linear 100ms fade-out-animation forwards");
        $(".intro-frame-container").append(
          "<div class='intro-text-score'><img class='tile-thumbnail' src='./assets/images/Intro-Text-Score.png'/></div>"
        );
        $(".turn-next-page-label")
          .css("opacity", 1)
          .css(
            "animation",
            "700ms cubic-bezier(0.6, -0.28, 0.735, 0.045) 500ms turn-next-page-label-hide-animation forwards"
          );

        var r = new Array(),
          j = -1;
        r[++j] =
          "<div class='turn-valve-label fade-expand-into'><img class='tile-thumbnail' src='./assets/images/Intro-Start-Mission-Button.png'/></div>";
        r[++j] =
          "<div class='home-button fade-expand-into'><img class='tile-thumbnail' src='./assets/images/Home-Button.png'/></div>";

        var obj = $(r.join(""));

        $("#page-container").append(obj);

        /* Home Button */
        $(".home-button").click(function (event) {
          init_home_page();
        });

        break;
      case 3:
        $(this).data("page", 4);

        /* Fade out home button and turn valve label. */
        $(".fade-expand-into").css("opacity", 1);
        $(".fade-expand-into").css(
          "animation",
          "400ms linear 100ms fade-expand-hide-animation forwards"
        );

        /* Delay abit, slide frame up, slide bottom down. Fade out background to white. */
        $(".intro-frame-container").css("top", "0px");
        $(".intro-frame-container").css(
          "animation",
          "800ms cubic-bezier(0.6, -0.28, 0.735, 0.045) intro-frame-container-hide-animation forwards"
        );

        $(".bottom-stages-container").css("top", "400px");
        $(".bottom-stages-container").css(
          "animation",
          "800ms cubic-bezier(0.310, 0.645, 0.585, 1.105) 1200ms bottom-stages-container-hide-animation forwards"
        );

        $(".white-background").delay(1800).animate(
          {
            opacity: 1,
          },
          800
        );

        /* SetTimeout init_question_page. */
        setTimeout(function () {
          current_score = 0;
          current_stage_index = 0;
          init_question_page();
        }, 3200);

        break;
    }
  });
}

function init_question_page() {
  clearPage();
  clearTimer();
  changeBackground("./assets/images/Background-White.png");
  current_function = "init_question_page";
  current_question_index = 0;
  current_stage_correct_count = 0;

  var scoreTemp = current_score + "";

  for (var i = 0; i < 4; i++) {
    if (scoreTemp.length < 4) {
      scoreTemp = "0" + scoreTemp;
    }
  }

  /* Question Frame */
  var r = new Array(),
    j = -1;
  r[++j] = "<div class='question-frame-container'>";
  r[++j] =
    "<div class='question-container'><div class='question-inner-container'></div></div>";
  r[++j] =
    "<div class='question-frame'><img class='tile-thumbnail' src='./assets/images/Game-Frame.png'/></div>";
  r[++j] = "<div class='question-home-button'></div>";
  r[++j] =
    "<div class='score-container-placeholder'><div class='score-number'>0</div></div>"; //solve jittering animation
  r[++j] =
    "<div class='score-container-1'><div class='score-number'>" +
    scoreTemp.charAt(0) +
    "</div></div>";
  r[++j] =
    "<div class='score-container-2'><div class='score-number'>" +
    scoreTemp.charAt(1) +
    "</div></div>";
  r[++j] =
    "<div class='score-container-3'><div class='score-number'>" +
    scoreTemp.charAt(2) +
    "</div></div>";
  r[++j] =
    "<div class='score-container-4'><div class='score-number'>" +
    scoreTemp.charAt(3) +
    "</div></div>";
  r[++j] = "</div>";

  var obj = $(r.join(""));

  $("#page-container").append(obj);

  $(".question-home-button").click(function (event) {
    /* Show ask quit popup first. */
    var r = new Array(),
      j = -1;
    r[++j] = "<div class='quit-container'>";
    r[++j] =
      '<div class="quit-popup"><img class="tile-thumbnail" src="./assets/images/Quit-Popup.png"/></div>';
    r[++j] =
      "<div class='continue-button'></div><div class='quit-button'></div>";
    r[++j] = "</div>";

    var obj = $(r.join(""));

    $("#page-container").append(obj);

    obj.find(".continue-button").click(function (event) {
      obj.remove();
    });

    obj.find(".quit-button").click(function (event) {
      init_home_page();
    });
  });

  /* Bottom Stages Panel */
  var r = new Array(),
    j = -1;
  r[++j] = "<div class='question-bottom-stages-container'>";
  r[++j] =
    "<div class='lady-popup lady-hide'><img class='tile-thumbnail' src='./assets/images/Lady.png'/></div>";
  r[++j] =
    "<div class='do-you-know-popup'><img class='tile-thumbnail' src='./assets/images/Do-You-Know.png'/><div class='do-you-know-text'>DO YOU KNOW?</div></div>";
  r[++j] =
    "<div class='bottom-stages-background'><img class='tile-thumbnail' src='./assets/images/Bottom-Stages-Container.png'/></div>";
  r[++j] =
    "<div class='stage-1-label stage-label'><img class='tile-thumbnail' src='./assets/images/Stage-One.png'/></div>";
  r[++j] =
    "<div class='stage-2-label stage-label'><img class='tile-thumbnail' src='./assets/images/Stage-Two.png'/></div>";
  r[++j] =
    "<div class='stage-3-label stage-label'><img class='tile-thumbnail' src='./assets/images/Stage-Three.png'/></div>";
  r[++j] =
    "<div class='stage-4-label stage-label'><img class='tile-thumbnail' src='./assets/images/Stage-Four.png'/></div>";
  r[++j] = "</div>";

  var obj = $(r.join(""));

  $("#page-container").append(obj);

  $(".stage-" + (current_stage_index + 1) + "-label").addClass(
    "inactive-stage-label"
  );

  window.scrollTo(0, 0); /* In case bottom force scroll down. */

  /* Prepare Question List */
  buildQuestionList(current_stage_index);

  /* Show First Question */
  showQuestion(current_question_index);
}

function buildQuestionList(stage_index) {
  var index_list = new Array();
  var loop_count = 0;
  var question_count = questions[stage_index].length;
  current_question_set = [];

  /* Show 3 question out of 8 questions per game - random order */

  while (index_list.length < 3 && loop_count < 30) {
    var random_number = Math.floor(Math.random() * question_count);
    if (index_list.indexOf(random_number) == -1) {
      index_list.push(random_number);
      current_question_set.push(questions[stage_index][random_number]);
    }
    loop_count++;
  }
}

function showQuestion(question_index) {
  /* Answers - Random Order */
  var index_list = new Array();
  var loop_count = 0;
  var answer_count = current_question_set[question_index]["answers"].length;
  var explanation = current_question_set[question_index]["explanation"];
  var next_button_label =
    question_index < current_question_set.length - 1
      ? "NEXT QUESTION"
      : "STAGE COMPLETED";

  while (index_list.length < answer_count && loop_count < 30) {
    var random_number = Math.floor(Math.random() * answer_count);
    if (index_list.indexOf(random_number) == -1) {
      index_list.push(random_number);
    }
    loop_count++;
  }

  var correct_char_index = 0;
  var correct_text = "";

  var r = new Array(),
    j = -1;

  /* Question Number */
  r[++j] =
    "<div class='question-blue-circle'><img class='tile-thumbnail' src='./assets/images/Blue-Circle.png'/></div>";
  r[++j] = "<div class='question-number'>0" + (question_index + 1) + "</div>";
  r[++j] = "<div class='question-inner-box'>";
  /* Question */
  r[++j] =
    "<div class='question-text'>" +
    current_question_set[question_index]["question"] +
    "</div>";
  /* Answers */
  for (var i = 0; i < index_list.length; i++) {
    var correct_answer =
      current_question_set[question_index]["correct_index"] == index_list[i]
        ? 1
        : 0;
    var answer_text =
      current_question_set[question_index]["answers"][index_list[i]];

    if (correct_answer == 1) {
      correct_text = $("<div/>").text(answer_text).html();
      correct_char_index = i;
    }

    r[++j] =
      "<div class='answer-click' data-is-correct='" +
      correct_answer +
      "'><div class='answer-droplet'><img class='tile-thumbnail' src='./assets/images/drop-" +
      i +
      ".png'/></div><div class='answer'>" +
      answer_text +
      "</div></div>";
  }
  r[++j] = "</div>";

  var obj = $(r.join(""));

  /* Delete Existing Question First. */
  $(".question-inner-container").empty();

  $(
    "#page-container .question-frame-container .question-container .question-inner-container"
  ).append(obj);
  $(".question-inner-container").data("char", answer_index[correct_char_index]);
  $(".question-inner-container").data("text", correct_text);

  /* Check If After Answer Question. If Yes, Slide Down and Clear Exising Explain Box Else Direct Create Explain Box. */
  var defer = $.Deferred();
  var promise = defer.promise();

  promise.then(function () {
    /* Explain Box */
    $(".right-wrong-box").remove();
    var r = new Array(),
      j = -1;
    r[++j] =
      "<div class='you-right-box right-wrong-box'><img class='tile-thumbnail' src='./assets/images/You-Are-Right.png'/><div class='explain-text'></div></div>";
    r[++j] =
      "<div class='you-wrong-box right-wrong-box'><img class='tile-thumbnail' src='./assets/images/You-Are-Incorrect.png'/><div class='explain-text'></div></div>";
    var obj = $(r.join(""));
    $("#page-container .question-frame-container .question-container").append(
      obj
    );
  });

  if ($(".question-inner-container").position().top > 200) {
    if ($(".question-inner-container").data("is-correct") == 1) {
      $(".you-right-box")
        .css("top", "5.7265px")
        .css(
          "animation",
          "600ms cubic-bezier(0.77, 0, 0.175, 1) 500ms you-right-box-hide-animation forwards"
        );
    } else {
      $(".you-wrong-box")
        .css("top", "-2.7735px")
        .css(
          "animation",
          "600ms cubic-bezier(0.77, 0, 0.175, 1) 500ms you-wrong-box-hide-animation forwards"
        );
    }
    $(".question-inner-container")
      .css("top", "472.274px")
      .css(
        "animation",
        "600ms cubic-bezier(0.77, 0, 0.175, 1) 500ms question-inner-container-show-animation forwards"
      );

    setTimeout(function () {
      defer.resolve();
    }, 1100);
  } else {
    defer.resolve();
  }

  /* On Event For Answer Click */
  $(".answer-click").click(function (event) {
    $(".answer-click").off("click");

    var is_correct = $(this).data("is-correct");
    var char_name = $(".question-inner-container").data("char");
    var answer_text = $(".question-inner-container").data("text");

    $(".question-inner-container").data("is-correct", is_correct);

    /* Bold Text */
    $(this).find(".answer").css("font-weight", "bold").css("font-size", "30px");

    /* Slide Up Lady */
    $(".question-bottom-stages-container .lady-popup")
      .css("top", "320px")
      .css(
        "animation",
        "600ms cubic-bezier(0.075, 0.82, 0.165, 1) 200ms lady-show-animation forwards"
      );

    if (is_correct == 1) {
      $(this).find(".answer").css("color", "green");
      $(".you-right-box .explain-text").html(explanation);

      /* Explanation too long. */
      if ($(".you-right-box .explain-text")[0].scrollHeight > 160) {
        $(".you-right-box .explain-text").css("top", "168.637px");
      } else {
        $(".you-right-box .explain-text").css("top", "208.637px");
      }

      /* Slide Down You Are Right. */
      $(".you-right-box")
        .css("top", "-444px")
        .css(
          "animation",
          "600ms cubic-bezier(0.77, 0, 0.175, 1) 500ms you-right-box-show-animation forwards"
        );
      $(".question-inner-container")
        .css("top", "50.429px")
        .css(
          "animation",
          "600ms cubic-bezier(0.77, 0, 0.175, 1) 500ms question-inner-container-hide-animation forwards"
        );

      /* Add Score And Display New Score. */
      addScore(score_rate[current_stage_index]);

      /* Do You Know Bubble. */
      $(".do-you-know-popup")
        .css("top", "8.297px")
        .css("opacity", 0)
        .css(
          "animation",
          "600ms cubic-bezier(0.77, 0, 0.175, 1) 1400ms fade-expand-animation forwards"
        );
      $(".do-you-know-text").css("display", "none").delay(1400).fadeIn(1000);

      /* Next Button */
      var obj = $(
        "<div class='next-button'>" +
          next_button_label +
          " <span class='next-symbol'>&rsaquo;</span></div>"
      );

      $("#page-container .question-frame-container .question-container").append(
        obj
      );
      $(".next-button")
        .css("opacity", 0)
        .css(
          "animation",
          "400ms cubic-bezier(0.455, 0.03, 0.515, 0.955) 2000ms next-button-show-animation forwards"
        );

      $(".next-button").click(function (event) {
        $(this).off("click");
        nextStep();
      });
    } else {
      $(this).find(".answer").css("color", "red");

      var r = new Array(),
        j = -1;
      r[++j] =
        "<span class='explain-title-text-one'>The correct answer is <b>" +
        char_name +
        ":</b><br /></span><br />";
      r[++j] =
        "<span class='explain-title-text-two'>" + answer_text + "</span>";

      /* Reset Explain Text Top. */
      $(".you-wrong-box .explain-text").css("top", "208.637px");

      /* You Are Wrong */
      $(".you-wrong-box .explain-text").html(r.join(""));

      /* Slide Down You Are Wrong. */
      $(".you-wrong-box")
        .css("top", "-461px")
        .css(
          "animation",
          "600ms cubic-bezier(0.77, 0, 0.175, 1) 500ms you-wrong-box-show-animation forwards"
        );
      $(".question-inner-container")
        .css("top", "50.429px")
        .css(
          "animation",
          "600ms cubic-bezier(0.77, 0, 0.175, 1) 500ms question-inner-container-hide-animation forwards"
        );

      /* Timer To Show Bubble, Explaination and Next Button */
      setTimeout(function () {
        /* Update Explain Text. */
        $(".you-wrong-box .explain-text").fadeOut(400, function () {
          $(this)
            .html(explanation)
            .ready(function () {
              /* Explanation too long. */
              if ($(".you-wrong-box .explain-text")[0].scrollHeight > 160) {
                $(".you-wrong-box .explain-text").css("top", "186.637px");
              }
            });

          $(this).fadeIn(400);
        });

        /* Do You Know Bubble. */
        $(".do-you-know-popup")
          .css("top", "8.297px")
          .css("opacity", 0)
          .css(
            "animation",
            "400ms cubic-bezier(0.77, 0, 0.175, 1) 1400ms fade-expand-animation forwards"
          );
        $(".do-you-know-text").css("display", "none").delay(1200).fadeIn(800);

        /* Next Button */
        var obj = $(
          "<div class='next-button'>" +
            next_button_label +
            " <span class='next-symbol'>&rsaquo;</span></div>"
        );

        $(
          "#page-container .question-frame-container .question-container"
        ).append(obj);
        $(".next-button")
          .css("opacity", 0)
          .css(
            "animation",
            "400ms cubic-bezier(0.455, 0.03, 0.515, 0.955) 2000ms next-button-show-animation forwards"
          );

        $(".next-button").click(function (event) {
          $(this).off("click");
          nextStep();
        });
      }, 3000);
    }
  });
}

function addScore(scoreAdded) {
  current_stage_correct_count++;
  var oldScore = current_score + "";
  current_score += scoreAdded;
  var newScore = current_score + "";

  for (var i = 0; i < 4; i++) {
    if (oldScore.length < 4) {
      oldScore = "0" + oldScore;
    }
    if (newScore.length < 4) {
      newScore = "0" + newScore;
    }
  }

  /* Digit change count. Animate current score change. */
  for (var i = 0; i < 4; i++) {
    if (oldScore.charAt(i) != newScore.charAt(i)) {
      /* Animate */
      $(".score-container-" + (i + 1)).append(
        "<div class='score-number'>" + newScore.charAt(i) + "</div>"
      );
      $(".score-container-" + (i + 1) + " .score-number:first")
        .delay(1100)
        .animate({ "margin-top": "-38.245px" }, 600, function () {
          $(this).remove();
        });
    }
  }
}

function nextStep() {
  /* Hide Popup Lady, Do You Know And Next Button. */
  $(".question-bottom-stages-container .lady-popup")
    .css("top", "-0.783px")
    .css(
      "animation",
      "1200ms cubic-bezier(0.310, 0.645, 0.585, 1.105) 200ms lady-hide-animation forwards"
    );

  /* Slide Down Do You Know. Then Set Opacity To Zero And Revert Position Back. */
  $(".do-you-know-popup")
    .css("top", "8.297px")
    .css("opacity", 1)
    .css(
      "animation",
      "1200ms cubic-bezier(0.310, 0.645, 0.585, 1.105) 200ms do-you-know-popup-hide-animation forwards"
    );

  /* Hide Next Button */
  $(".next-button")
    .css("opacity", 1)
    .css(
      "animation",
      "400ms cubic-bezier(0.455, 0.03, 0.515, 0.955) 200ms next-button-hide-animation forwards"
    );

  /* Determine Whether Next Question, End Stage */
  current_question_index++;
  if (current_question_index < current_question_set.length) {
    showQuestion(current_question_index);
  } else {
    endStage();
  }
}

function endStage() {
  /* Slide up pipe frame. */
  $(".question-frame-container")
    .css("top", "0px")
    .css(
      "animation",
      "800ms cubic-bezier(0.6, -0.28, 0.735, 0.045) 800ms question-frame-container-hide-animation forwards"
    );

  /* Slide down bottom frame. */
  $(".question-bottom-stages-container")
    .css("top", "400px")
    .css(
      "animation",
      "800ms cubic-bezier(0.310, 0.645, 0.585, 1.105) 2000ms bottom-stages-container-hide-animation forwards"
    );

  setTimeout(function () {
    init_end_stage_page();
  }, 3200);
}

function init_end_stage_page() {
  clearPage();
  clearTimer();
  changeBackground("./assets/images/Background-White.png");
  current_function = "init_end_stage_page";

  var description =
    "You have collected " +
    current_score +
    " litres of water! You are now a " +
    stage_role_name[current_stage_index] +
    "!";
  var small_font_class =
    current_stage_correct_count < min_correct_per_stage[current_stage_index]
      ? "result-description-small"
      : "";

  if (
    current_stage_correct_count < min_correct_per_stage[current_stage_index]
  ) {
    var need_score =
      (min_correct_per_stage[current_stage_index] -
        current_stage_correct_count) *
      score_rate[current_stage_index];
    description =
      "You have collected " +
      current_score +
      " litres of water. You need " +
      need_score +
      " more litres of water to be a " +
      stage_role_name[current_stage_index] +
      ".";
  }

  if (current_score == 0) {
    description =
      "You have not collected any water. You need 10 litres of water to be a Water Novice.";
  }

  /* Perfect Score */
  if (current_score >= min_perfect_score) {
    small_font_class = "result-description-small";
    description =
      "Congratulations! You have successfully collected " +
      current_score +
      " litres of water. This amount of water is enough to meet the water needs of a person in a day!";
  }

  /* Slide hand down */
  var r = new Array(),
    j = -1;
  r[++j] = "<div class='end-stage-container'>";
  r[++j] =
    "<div class='end-stage-hand'><img class='tile-thumbnail' src='./assets/images/Stage-Score-Hand.png'/></div>";
  r[++j] =
    "<div class='home-button fade-expand-into'><img class='tile-thumbnail' src='./assets/images/Home-Button.png'/></div>";

  /* Water drop with score, hidden badge, description */
  r[++j] =
    "<div class='water-drop'><div class='score-in-drop'>" +
    current_score +
    "</div><img class='tile-thumbnail' src='./assets/images/Water-Drop.png'/></div>";
  r[++j] =
    "<div class='result-description " +
    small_font_class +
    "'>" +
    description +
    "</div>";
  r[++j] = "<div class='badge-container'>";
  r[++j] =
    "<div class='badge-background'><img class='tile-thumbnail' src='./assets/images/Badge-Background.png'/></div>";
  r[++j] =
    "<div class='badge-outer-ring'><img class='tile-thumbnail' src='./assets/images/Badge-Outer-Ring.png'/></div>";
  r[++j] =
    "<div class='inner-ring'><img class='tile-thumbnail' src='./assets/images/Blue-Circle-" +
    current_stage_index +
    ".png'/></div>";
  r[++j] = "</div>";
  r[++j] = "</div>";

  var obj = $(r.join(""));

  $("#page-container").append(obj);

  /* Home Button */
  $(".home-button").click(function (event) {
    init_home_page();
  });

  /* Bottom Stages Panel */
  var r = new Array(),
    j = -1;
  r[++j] = "<div class='bottom-stages-container'>";
  r[++j] =
    "<div class='bottom-stages-background'><img class='tile-thumbnail' src='./assets/images/Bottom-Stages-Container.png'/></div>";
  r[++j] =
    "<div class='stage-1-label stage-label'><img class='tile-thumbnail' src='./assets/images/Stage-One.png'/></div>";
  r[++j] =
    "<div class='stage-2-label stage-label inactive-stage-label'><img class='tile-thumbnail' src='./assets/images/Stage-Two.png'/></div>";
  r[++j] =
    "<div class='stage-3-label stage-label inactive-stage-label'><img class='tile-thumbnail' src='./assets/images/Stage-Three.png'/></div>";
  r[++j] =
    "<div class='stage-4-label stage-label inactive-stage-label'><img class='tile-thumbnail' src='./assets/images/Stage-Four.png'/></div>";
  r[++j] = "</div>";

  var obj = $(r.join(""));

  $("#page-container").append(obj);

  obj.find(".stage-label").removeClass("inactive-stage-label");

  obj
    .find(".stage-" + (current_stage_index + 1) + "-label")
    .addClass("inactive-stage-label");

  window.scrollTo(0, 0); /* In case bottom force scroll down. */

  /* Check score if can move to next level. Show next round or fail. */
  if (
    current_stage_correct_count < min_correct_per_stage[current_stage_index]
  ) {
    /* Show Try Again Button */
    var obj = $(
      "<div class='try-again-button fade-expand-into'><img class='tile-thumbnail' src='./assets/images/Try-Again-Button.png'/></div>"
    );

    $("#page-container").append(obj);

    $(".try-again-button").click(function (event) {
      init_home_page();
    });
  } else {
    /* Show badge rotations effect. Start after 1 second. Swing include words as well. */
    /* Rotate water drop and disapper */
    $(".water-drop").css(
      "animation",
      "2600ms cubic-bezier(0.215, 0.080, 0.935, 0.125) 1250ms water-drop-animation forwards," +
        "2600ms cubic-bezier(0.215, 0.080, 0.935, 0.125) 1250ms water-drop-fade-out-animation forwards"
    );

    /* Rotate-in blue-ring and inner-ring from y in 90 degree. expanded, shrink in rotate. */
    $(".badge-outer-ring").css(
      "animation",
      "2600ms cubic-bezier(0.19, 1, 0.22, 1) 3650ms badge-outer-ring-animation forwards"
    );
    $(".inner-ring").css(
      "animation",
      "2600ms cubic-bezier(0.19, 1, 0.22, 1) 3650ms inner-ring-animation forwards"
    );

    /* Expand outer ring */
    $(".badge-background").css(
      "animation",
      "800ms cubic-bezier(0.075, 0.82, 0.165, 1) 5050ms badge-background-animation forwards"
    );

    /* Fade in, zoom out star. Depends on stage. */

    switch (current_stage_index) {
      case 0:
        /* one star */
        var obj = $(
          "<div class='stage-1-star star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>"
        );
        $(".badge-container").append(obj);
        break;
      case 1:
        /* two star */
        var r = new Array(),
          j = -1;
        r[++j] =
          "<div class='stage-2-star-1 star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>";
        r[++j] =
          "<div class='stage-2-star-2 star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>";
        $(".badge-container").append(r.join(""));
        break;
      case 2:
        /* three star */
        var r = new Array(),
          j = -1;
        r[++j] =
          "<div class='stage-3-star-1 star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>";
        r[++j] =
          "<div class='stage-3-star-2 star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>";
        r[++j] =
          "<div class='stage-3-star-3 star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>";
        $(".badge-container").append(r.join(""));
        break;
      case 3:
        /* four star */
        var r = new Array(),
          j = -1;
        r[++j] =
          "<div class='stage-4-star-1 star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>";
        r[++j] =
          "<div class='stage-4-star-2 star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>";
        r[++j] =
          "<div class='stage-4-star-3 star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>";
        r[++j] =
          "<div class='stage-4-star-4 star-expand-into'><img class='tile-thumbnail' src='./assets/images/Star.png'/></div>";
        $(".badge-container").append(r.join(""));
        break;
    }

    /* Star expand into effect */
    $(".star-expand-into").css(
      "animation",
      "1700ms cubic-bezier(1, 0, 0, 1) 5500ms star-animation forwards"
    );

    /* Still have next level */
    if (current_stage_index < score_rate.length - 1) {
      current_stage_index++;

      /* Show next stage timer */
      var obj = $(
        "<div class='next-stage-timer fade-expand-into-slow'><div></div><img class='tile-thumbnail' src='./assets/images/Next-Stage-Timer.png'/></div>"
      );

      $("#page-container").append(obj);

      var next_time = 10;

      var next_time_timer = setInterval(function () {
        next_time--;
        $(".next-stage-timer div").html(next_time + "s");
        if (next_time < 0) {
          clearInterval(next_time_timer);
        }
      }, 1000);

      /* Timer for next page. */
      toastTimer = setTimeout(function () {
        /* Disable Home Button */
        $(".home-button").off("click");

        /* Slide Up Hand */
        $(".end-stage-container")
          .css("top", "0px")
          .css(
            "animation",
            "2000ms cubic-bezier(0.310, 0.645, 0.585, 1.105) 800ms end-stage-container-hide-animation forwards"
          );

        /* Slide down bottom frame. */
        $(".bottom-stages-container")
          .css("top", "400px")
          .css(
            "animation",
            "800ms cubic-bezier(0.310, 0.645, 0.585, 1.105) 2000ms bottom-stages-container-hide-animation forwards"
          );

        /* Fade Out Home Button */
        $(
          ".fade-expand-into, .fade-expand-into-slow, .fade-expand-into-slow div"
        )
          .css("opacity", "1")
          .css(
            "animation",
            "400ms linear 100ms fade-expand-hide-animation forwards"
          );

        /* Next stage */
        setTimeout(function () {
          init_question_page();
        }, 3200);
      }, next_time * 1000);
    } else {
      /* Final Stage */

      /* If perfect score, show congratulations label. */
      if (current_score >= min_perfect_score) {
        /* Show after spin effect */
        var obj = $(
          "<div class='congratulations'><img class='tile-thumbnail' src='./assets/images/Congratulations.png'/></div>"
        );
        $("#page-container").append(obj);

        $(".congratulations").css(
          "animation",
          "1700ms cubic-bezier(1, 0, 0, 1) 5500ms star-animation forwards"
        );
      }

      /* Show restart button. */
      var obj = $(
        "<div class='restart-game-button restart-game-button-expand-into'><img class='tile-thumbnail' src='./assets/images/Restart-Game-Button.png'/></div>"
      );

      $("#page-container").append(obj);

      $(".restart-game-button").click(function (event) {
        init_home_page();
      });

      /* Wait 20 seconds before going back homepage. */
      toastTimer = setTimeout(function () {
        init_home_page();
      }, 30000);
    }
  }
}

function init_idle_timeout() {
  if (idle_second != 0) {
    var idle = setInterval(function () {
      current_idle++;
      if (current_idle > idle_second) {
        current_idle = 0;
        init_home_page();
      }
    }, 1000);

    $("body").click(function () {
      current_idle = 0;
    });
  }
}

function clearTimer() {
  clearTimeout(toastTimer);
}

function calculateRatio() {
  var container_width = $("#container").width();
  ratio = container_width / frame_width;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function changeBackground(src) {
  $(".page-background").remove();
  $("#scale-container").append(
    '<img class="page-background" src="' + src + '"/>'
  );
}

function clearPage() {
  $("#page-container").empty();
  calculateRatio();
}

function rescale(obj, options) {
  $.each(obj, function () {
    $(this)
      .width($(this).width() * ratio)
      .height($(this).height() * ratio);
    var target_obj = $(this);

    if (typeof options !== "undefined") {
      $.each(options, function (i, val) {
        switch (val) {
          case "left":
            target_obj.css("left", target_obj.position().left * ratio + "px");
            break;
          case "top":
            target_obj.css("top", target_obj.position().top * ratio + "px");
            break;
          case "right":
            target_obj.css(
              "right",
              parseInt(target_obj.css("right").replace("px", "")) * ratio + "px"
            );
            break;
          case "font":
            target_obj.css(
              "font-size",
              parseInt(target_obj.css("font-size").replace("px", "")) * ratio +
                "px"
            );
            break;
          case "padding":
            target_obj.css(
              "padding",
              parseInt(target_obj.css("padding").replace("px", "")) * ratio +
                "px"
            );
            break;
          case "border-radius":
            target_obj.css(
              "border-radius",
              parseInt(target_obj.css("border-radius").replace("px", "")) *
                ratio +
                "px"
            );
            break;
          case "border-width":
            target_obj.css(
              "borderWidth",
              parseInt(target_obj.css("borderWidth").replace("px", "")) *
                ratio +
                "px"
            );
            break;
        }
      });
    }
  });
}
