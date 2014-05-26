Foundation.set_namespace = function() {};
$(document).foundation(); // foundation core init

jQuery(document).ready(function(){

	/////////////////
	//  COUNTDOWN  //
	/////////////////

	var ts = new Date().getTime();
	var interval = 3 * 24 * 60 * 60 * 1000;
	var tm = 0;
	var result = tm + interval * ( Math.floor((ts - tm) / interval) + 1 ) - ts;

	// var days = 2; // days until countdown
	// var hours  = 2; // hours until countdown
	// var minutes = 20; // minutes until countdown
	// var seconds = 30; // seconds until countdown

	// var result = seconds + minutes*60 + hours*60*60 + days*24*60*60;

	var clock = $('#countdown').FlipClock(result/1000, {
		countdown: true,
		hideLabels: true
	});

	$('.flip-clock-wrapper ul li a').on( 'click', function( event ) {
		event.preventDefault();
	});

	/////////////////
	//    SCROLL   //
	/////////////////

	if (BrowserDetect.browser == 'Opera' && BrowserDetect.version <= 12) { 
		$('a[data-scroll]').click(function(e){
		    scrollFrom = $(window).scrollTop();
		    var target = $(this).attr('href');
		    $(window.opera?'html':'html, body').animate({ 
		        scrollTop: $(target).offset().top-0
		    },1000);
		});
	} else {
		smoothScroll.init({
		    speed: 500, // scroll speed (ms)
		    easing: 'easeInOutCubic', // easing
		    updateURL: true // url hash update
		});
	}

	/////////////////////
	//  HERO "SLIDER"  //
	/////////////////////

	$('a.switch').on( 'click', function( event ) {
		event.preventDefault();
		$('.hero-item').removeClass('active');
		$(this).children( ".hero-item" ).addClass('active');
		$('.slider-item').fadeOut(200, function() {
			$('#'+itemValue).fadeIn(200);
		});
		var itemValue = $(this).attr('data-item-value');
	});

	////////////////////////
	//  PLACEHOLDERS FIX  //
	////////////////////////

	if ($.fn.placeholder.input && $.fn.placeholder.textarea) {
	} else if ($.fn.placeholder.input) {
		$('textarea').placeholder();
	} else {
		$('input, textarea').placeholder();
	}

	////////////////////////
	//  FORMS VALIDATION  //
	////////////////////////

	//$('input[name=phone]').mask('+7 (000) 000-00-00');

	// var options =  {onKeyPress: function(cep){
	//   var masks = ['+7 (000) 000-00-00', '8 (000) 000-00-00'];
	//     mask = (cep.charAt(0)=="8") ? masks[1] : masks[0];
	//   $('input[name=phone]').mask(mask, this);
	// }};

	// $('input[name=phone]').mask('+7 (000) 000-00-00', options);

	$('form').each(function() {
        $(this).validate({
            errorPlacement: $.noop,
	        submitHandler: function(form) {
			    $(form).submitForm();
			}
        });
    });

});

$(window).load(function() {
	/////////////////////////
	//  ISOTOPE (GALLERY)  //
	/////////////////////////

	var $container = $('#container');
	$container.isotope({
	  itemSelector: '.item',
	  layoutMode: 'fitRows'
	});
        
    $container.isotope({ filter: '.auto' });

	$('#filters').on( 'click', 'a', function( event ) {
	  event.preventDefault();
	  var filterValue = $(this).attr('data-filter-value');
	  $container.isotope({ filter: filterValue });
	  $('#filters a').removeClass("active");
	  $(this).addClass("active");
	});
});

////////////////////////////
//  FORM SUBMIT FUNCTION  //
////////////////////////////

$.fn.submitForm = function() {

	var form = $(this);
	var preloaderHTML = '<div class="form-preloader" style="display: none;"><div><i class="fa fa-refresh fa-spin"></i></div></div>';
	var okHTML = '<i class="fa fa-check"></i><br />Сообщение отправлено!';
	var errorHTML = '<i class="fa fa-frown-o"></i><br />Произошла ошибка!';

	form.parent().append(preloaderHTML);
	var preloader = $(this).parent().find('.form-preloader');

	var preloaderHeight = preloader.height();
	var innerHeight = preloader.find('div').height();
	var preloaderPadding = ((preloaderHeight/2) - innerHeight/2) + 10;
	preloader.css("padding-top", preloaderPadding + "px");

	preloader.fadeIn(300);

	var fields = form.find("input[type=text], input[type=email], textarea");
	var data = {};
	data["formName"] = form.attr("data-title");

	console.log(data.formName);

	// Yandex.Metrika Goals Triggers
	switch (data.formName) {
		case "Нужно оформить груз":
		case "Нужно отправить груз?":
		case "Нужно найти поставщиков?":
		case "Отправьте заявку сейчас и получите скидку 20%":
		  yaCounter20566159.reachGoal('1');
		  break
	    case "Заказать расчет вывоза груза":
	      yaCounter20566159.reachGoal('2');
	      break
	    case "Заказать обратный звонок":
	      yaCounter20566159.reachGoal('3');
	      break
	}


	$(fields).each(function(){
		var name = $(this).attr("name");
		var val = $(this).val();
		data[name] = val;
	});

	data["secret"] = "60049e4af9eeed9c98fe812140005439";

	var isError = false;

	$.ajax({
	  type: "POST",
	  url: "/",
	  data: JSON.stringify(data),
	  contentType: "application/json; charset=utf-8",
      success: function (data) {
      	preloader.find('div').html(okHTML);
      },
      error: function (data) {
      	isError = true;
      	preloader.find('div').html(errorHTML);
      }
	});

	$('.form-preloader').click(function() {
		$(this).fadeOut(300, function() {
			$(this).remove();
		});
		if (!isError) {
			fields.val('');
		}
	});

}

/////////////////////////
//  BROWSER DETECTION  //
/////////////////////////

var BrowserDetect = 
{
    init: function () 
    {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
    },

    searchString: function (data) 
    {
        for (var i=0 ; i < data.length ; i++)   
        {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1)
            {
                return data[i].identity;
            }
        }
    },

    searchVersion: function (dataString) 
    {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },

    dataBrowser: 
    [
        { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
        { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
        { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
    ]

};

BrowserDetect.init();