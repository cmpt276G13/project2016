// $(function(){
//    $('.tab-panels .tabs li').on('click',function(){
//       $('.tab-panels.tabs li.active').removeClass('active');
//       $(this).addClass('active');
//       //figure out which panel to show
//       //paneltoshow //where my mouse points at
//       var panelToShow= $(this).attr('rel');
      
//       $('.tab-panels .panel.active').slideUp(300,showNextPanel);
      
//       function showNextPanel(){
//           $(this).removeClass('active');
//           $('#'+panelToShow).slideDown(300,function() {
//              $(this).addClass('active');
//           });
//       }
//    }); 
// });

// $(document).ready(function(){
//     $("<% image_tag %>").click(function(){
//         alert("hithere");
//     });
// });

function activateGIF(gifID, gifsrc, timeout) {
    var animsrc = $(gifsrc).attr('src'); //Get animation source
    var src = $(gifID).attr('src'); //Get static img source
    var onclick = $(gifID).attr('onclick'); //Get 'onclick'  into gifID object
    $(gifID).attr('src', animsrc).removeAttr('onclick').show(); //Attribute onclick should be removed, 'cause this function gets fired every time a clickevent gets fired
    setTimeout( function(){
        $(gifID).attr('src', src).attr('width', '350').attr('height', '300').attr('onclick', onclick);
        
    }, timeout); //sets timeout, so animation stops
}