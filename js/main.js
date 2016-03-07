$(document).ready(function () {
    
var canHeight = 60;
var canWidth = 80;
var pixelSize = 6;
var isDown = false;
var $canvasMethod;
var ink = "black";


/*  Functions we'll be calling: */
 
    function isInteger(x) {
        return x % 1 === 0;
    }
 
   
/*  Functions that set up the canvas or reset the canvas when user requests it */

    function drawCanvas() {
        for(n = 0; n<canHeight; n++) {
            drawLine("line"+n);
        }
        
        /* Set up pixel size */
    
        $(".padElement").css("width",pixelSize + "px");
        $(".padElement").css("height",pixelSize + "px");
        $(".padElement").css("visibility", "visible");
    }
      
    function drawLine(lineNum) {
        $("#wrapper").append("<div id='"+lineNum+"'class='padLine'></div>");
        for(i = 0; i<canWidth; i++) {
    
            $("#" + lineNum).append("<div class='padElement'></div>");
        }
    }
    
    function removeCanvas() {
        //Get rid of the old canvas
        
        $(".padElement").remove();
        $(".padLine").remove();
    }
    
    function resetCanvas() {
        // Let's check we've been given sensible dimensions
        
        // Get the max size of main (where we're going to draw the canvas)
        
        var maxHeight = $("main").height();
        var maxWidth = $("main").width();
        
        if (isInteger(canWidth)&&isInteger(canHeight)) {
        
            if (maxHeight <= canHeight*pixelSize || maxWidth <= canWidth*pixelSize) {
                alert("The size specified is too big for your window. Try again.");
            } else if (canHeight*canWidth/pixelSize >= 90000) {
                alert("If we draw you that many pixels it will take forever. Try again.");
            } else {
                $("#wrapper").css("width",canWidth*pixelSize);
                $("#wrapper").css("height",canHeight*pixelSize);
            
                removeCanvas();
                drawCanvas();
                drawing();
            }
        } else {
            alert("Numbers please!");
        }
    }
    
    /* The next function monitors the mouse and drawing grid for inputs */

    function drawing() {
    
    /* We want to draw on the grid if the mouse is over
     * a square with the mouse button held down.
     * If the right button is held down, erase (change back to standard background
     * color). This isn't what the assignment says to do, but seems more useful to me. */

    /* Let's monitor what buttons are pressed. It looks like I ought to explore whether
     * bind is a better way to do this that having a variable. */
 
 
        $('#wrapper').mousedown(function(event) {
            switch (event.which) {
                case 1:
                    isDown = "left";  // When left mouse goes down, set isDown to left
                    break;
                case 2:
                    isDown = "center";
                    break;
                case 3:
                    isDown = "right";
                    break;
                default:
                    isDown = false;
            }
        });

        $("body").mouseup(function() {
            isDown = false;    // When mouse goes up, set isDown to false
        });
    
    /* OK, now we know what state the mouse is in, let's change the color when
     * we mouse over the sketchpad. */
    
        $("#wrapper").mouseover(function(){
            /* Let's get a sensible mouse cursor for drawing first */
            $(this).css('cursor','crosshair');
        });
    
        $('.padElement').mouseover(function(){
            if (isDown === "left") {
                $(this).addClass(ink);
            } else if (isDown === "right") {
                $(this).removeClass("black");
                $(this).removeClass("red");
                $(this).removeClass("green");
                $(this).removeClass("blue");
            }
        });
        
        $("#black").on("click", function () {
            ink = "black";
        });
        
        $("#blue").on("click", function () {
            ink = "blue";
        });
        
        $("#red").on("click", function () {
            ink = "red";
        });
        
        $("#green").on("click", function () {
            ink = "green";
        });
    }
    
/* Finally we get to actions we want to take on start. Draw the grid
 * then start monitoring for drawing inputs */
    
/* Make sure the user doesn't see the reconfigure grid form */

    $('#collectData').dialog({
        autoOpen: false,
        resizable: false,
        position: {my:'right',at: 'top'},
        /* Hack to stop focus on first radio button in form */
        open: function () {             
            jQuery("#tiny").blur();
        }
    });
    
    $('#sizeData').dialog({
        autoOpen: false,
        resizable: false,
        position: {my:'right',at: 'top'}
    });
    
    $('#mouseData').dialog({
        autoOpen: false,
        resizable: false,
    });
    
    $('#instructions').dialog({
        autoOpen: false,
        resizable: false,
    });

    $(".configMess").css("visibility","visible");    
    
/* Let them know how to use the tool */

    $("#instructions").dialog('open');

// Hide the instructions when they ask us to.
    
    $("#continue").on("click", function () {
        $("#instructions").dialog("close");
    });

/*  Now we can draw the initial canvas and call the function that monitors for drawing
 *  on it. */
    
    drawCanvas();    
    drawing();
    

    
    
/* Clear or reconfigure the grid when the user asks us to */

    $("#clearButton").click(function () {
        $(".padElement").removeClass("black");
        $(".padElement").removeClass("red");
        $(".padElement").removeClass("green");
        $(".padElement").removeClass("blue");
    });

    
    
    $("#configButton").click(function() {
        
        var $size;
        
        $("#collectData").dialog('open');
        $("#formSaver1").on("click", function (event) {
        
            $size = $('input[name="pixelSize"]:checked', '#collectData').val();
            switch ($size) {
                case "tiny":
                    pixelSize = 2;
                    break;
                case "small":
                    pixelSize = 4;
                    break;
                case "medium":
                    pixelSize = 8;
                    break;
                case "large":
                    pixelSize = 12;
                    break;
                default:
                    pixelSize = false;
            }
           
        
            $canvasMethod = $('input[name="canvMeth"]:checked', '#collectData').val();
            switch ($canvasMethod) {
                case "mouse":
                    $("#mouseData").dialog('open');
                    $("#wrapper").resizable();
                    break;
                case "pixel":
                    $("#sizeData").dialog('open');
                    break;
                case "actual":
                    $("#sizeData").dialog('open');
                    break;
                default:
                    alert("You didn't select a canvas sizing method. Press 'Configure Canvas' again.")
            }
            $("#collectData").dialog("close"); 
            event.preventDefault();
        });
    });
    
    $("#formSaver2").on("click", function (event) {
        canHeight = $('input[name="height"]', '#sizeData').val();
        canWidth = $('input[name="width"]', '#sizeData').val();
        $("#sizeData").dialog("close");
        
        /* This next call stops the default action. I'm not sure why, but the default action
        seems to cause the page to reload and overwrites the new canvas  */
        
        event.preventDefault();
        
        // Are we sizing based on our pixels or on actual pixels?
        
        if ($canvasMethod === "actual") {
            
            /* They've specified the canvas in actual pixels. We need to figure out the
             * closest we can get to what they want using the specified pixel size */
            
            canHeight = Math.trunc(canHeight/pixelSize);
            canWidth = Math.trunc(canWidth/pixelSize);
        }
        
        resetCanvas();
    });
    
    $("#formSaver3").on("click", function (event) {
        $('#wrapper').resizable('destroy');
        $("#mouseData").dialog("close");
        
        canHeight = $("#wrapper").height();
        canWidth = $("#wrapper").width();


        event.preventDefault();
        
        /* We've got the canvas size in actual pixels again. We need to figure out the
         * closest we can get to what they want using the specified pixel size */
       
        canHeight = Math.trunc(canHeight/pixelSize);
        canWidth = Math.trunc(canWidth/pixelSize);
        
        resetCanvas();
    });


});