(function(){

		var touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch ? true : false;

		var buttonPrefixSvg = 'house';
		var mouseoverid;

		var units = [];
		var iframeHeight;
		var iframeTimer;
		var sliderPrice;
		var sliderLivingsurface;
		var activeUnitId = false;
		var sessionId;

		//var settings;
		
		var SALE_STATUS = {
			'for_sale' : 'vrij',
			'in_option' : 'optie',
			'sold' : 'verkocht'
		};


		$(document).ready(function(){
			if(window.self===window.top){
				$('#container').addClass('standalone');
			}
			//selectUnit(false);//put placeholders in place
			
			var url = './services/?action=getdata';
			$.getJSON(url, function(data) {
			 
				units = data.house;
			  	init();
//return;				
				/* Resolve querystring: */
				var qs = window.location.search.substr(1).split('&');
				var p = {};
				var uid = false;
				for(var i = 0; i < qs.length; ++i){
			        var a = qs[i].split('=', 2);
			        if (a.length == 1)p[a[0]] = "";
			        else p[a[0]] = decodeURIComponent(a[1].replace(/\+/g, " "));
			    }
			    if(p.uid) uid = p.uid;
			    selectUnit(uid);
				
			});
		});

		function init(){

			$('body').addClass(touch ? 'touch' : 'no-touch');
			$('#container').removeClass('init');

			$('a.btn').click(function(ev){
				if($(this).hasClass('btn-disabled')){
					return false;
				}
			});

			$('.unit-container-overlay').click(function(){
				selectUnit(false);
			});

			$('.unit-selector').onSwipe(function(results){
	  			if(results.left == true)$('#block-next').click();
	  			else if(results.right == true)$('#block-prev').click();
			});

			sliderPrice = document.getElementById('slider-price');
			sliderLivingsurface = document.getElementById('slider-livingsurface');

			//UNITS
			var numUnits = units.length;
			for(var i =0; i<numUnits; i++){			
				var id = buttonPrefixSvg+units[i].id;
				var $e = $('#block-container svg g[id="'+id+'"], #block-container svg g[id^="'+id+'."]');
				if(units[i].disabled == true){
					$e.addClass('disabled');
				}else{
					if(units[i].status) $e.addClass(formatClassName(units[i].status));
				}

				var status = formatProperty(units[i].status, 'status');
				var li = '<li';
				if(i==0)li += ' class="first"';
				li += ' data-id="'+units[i].id+'">';
				li += '<div class="item clearfix">';
				li += '<div class="image">';
				if(units[i].thumb) li += '<img src="./img/'+units[i].thumb+'">';
				else if(units[i].images && units[i].images.length) li += '<img src="./img/'+units[i].images[0]+'">';
				li += '</div>';
				li += '<div class="details">';
				li += '<span data-status="'+units[i].status+'">'+status+'</span>';
				li += '<h3>'+formatProperty(units[i].name, 'name')+' '+formatProperty(units[i].id, 'id')+'</h3>';
				li += '<span class="price">'+formatProperty(units[i].price, 'price')+'</span>';
				var lbl = (parseInt(units[i].roomcount)||0) ==1 ? 'kamer' : 'kamers';
				li += '<div class="info"><span>'+formatProperty(units[i].roomcount, 'roomcount')+' '+lbl+'</span> Â· <span>'+formatProperty(units[i].livingsurface, 'livingsurface')+'</span></div>';
				li += '</div>';
				li += '</div>';
				$('#unit-list ul').append(li);


			}

			$('#unit-list li[data-id]').mouseenter(onMouseOverlist).mouseleave(onMouseOutlist).click(function(e){
				selectUnit(e.currentTarget.dataset.id);
			});
			

			var $g = $('#block-container svg g[id^="'+buttonPrefixSvg+'"]');
			//$g.not('.disabled').on('touchstart click', onClickSVG);
			$g.mouseenter(onMouseOverSVG).mouseleave(onMouseOutSVG);


			$g.not('.disabled').click(onClickSVG).on('touchstart', function(event){
				$('#block-container svg g.hover').removeClass('hover').closest('div').removeClass('hover');
				onMouseOverSVG(event);
				if(window.innerWidth <= 1023){
					$('body').addClass('touch');
				}else{
					$('body').removeClass('touch');
					onClickSVG(event);
				}
				event.stopImmediatePropagation();
				return false;
			});
			
			$('#block-container .pointer').on('touchstart', function(event){
				var unitId = $(event.currentTarget).attr('data-unit-id');;
				selectUnit(unitId);
			});



			window.addEventListener('resize', function() {
		        setIframeHeight();
		    });



			//BLOCK
			$('div[id^="block-"] ul.tabbar li').click(function(){
				if($('body').hasClass('touch')){
					$('#block-container svg g.hover').removeClass('hover').closest('div').removeClass('hover');
					$('#block-container .pointer').hide();
				}
				var $tab = showTab(this, '.unit-selector');
				//if($tab) $tab.prepend($('.block-button'));
			}).filter(':first-child').click();


		    $('#block-next').click(function(e){   
	            var $tabs = $('div[id^="block-"] ul.tabbar li');
	            var idx = Math.max(0, $tabs.filter('.active').index());
	            idx = idx +1;
	            if(idx >= $tabs.length)idx = 0;
	            $tabs.eq(idx).click();
	        });

	        $('#block-prev').click(function(){
	            var $tabs = $('div[id^="block-"] ul.tabbar li');
	            var idx = Math.max(0, $tabs.filter('.active').index());
	            idx = idx -1;
	            if(idx < 0)idx = $tabs.length -1;
	             $tabs.eq(idx).click();
	        });


			//FILTER
			$('#unit-filter select').change(function(){
				filterBlock();
			});


			$('.filter-clear').click(function(){
				clearFilter();
				clearFilterResults();
				return false;
			});

			var $e = $('#unit-filter select[name="status"]');
			for(var p in SALE_STATUS){
				$e.append($('<option>', {value:SALE_STATUS[p]}).text(SALE_STATUS[p].capitalize()));
			}

			//UNIT:
			$('#unit-container #unit-close').click(function(){
				selectUnit(false);
			});

			$('#unit-form-btn, #unit-contact-btn').click(function(){
				log($(this).text(), activeUnitId);
			});


			//POPULATE FILTERS:
			var numFilters = $('#unit-filter .col').length;
			var minPrice;
			var maxPrice;
			var minLivingsurface;
			var maxLivingsurface;
			var select = {name:[], level:[], roomcount:[]};
			var i = units.length;

			while(i--){
				var p = units[i].price;
				var l = units[i].livingsurface;				
			
				if(p > 0){
					if(minPrice == undefined) minPrice = p;
					else minPrice = Math.min(minPrice, p);
					if(maxPrice == undefined) maxPrice = p;
					else maxPrice = Math.max(maxPrice, p);
				}
				if(l > 0){
					if(minLivingsurface == undefined) minLivingsurface = l;
					else minLivingsurface = Math.min(minLivingsurface, l);
					if(maxLivingsurface == undefined) maxLivingsurface = l;
					else maxLivingsurface = Math.max(maxLivingsurface, l);
				}

				for(var p in select){
					var a = units[i][p];
					if(!$.isArray(units[i][p])) a = [units[i][p]];
					var j = a.length;
					while(j--){
						//var val = parseInt(a[j]);
						//if(!isNaN(val) && select[p].indexOf(val) == -1) select[p].push(val);
						var val = a[j];
						//var s = ' (+1)';
						//if(String(val).indexOf(s)>=0){
						//	val = parseInt(String(val).replace(s, ''));
						//}
						if(val && select[p].indexOf(val) == -1) select[p].push(val);
					}
				}
			}


			//var defaultFormatter = { 'to': function( value ){
			//	return value !== undefined && String(value).formatCurrency();
			//}, 'from': Number };

			var step = 10000;
			maxPrice = maxPrice ? Math.ceil(maxPrice / step) * step : 0;
			minPrice = minPrice ? Math.floor(minPrice / step) * step : 0;
			
			//KLUDGE: set max price to "3500000" because "op aanvraag" prices
			//maxPrice = 3500000;

			if(!setSlider(sliderPrice, minPrice, maxPrice, step)) numFilters--; 

			if(sliderPrice.noUiSlider){
				sliderPrice.noUiSlider.on('update', function( values, handle ) {
					$('#unit-filter #price-from').text(values[0].formatCurrency());
					$('#unit-filter #price-to').text(values[1].formatCurrency());
				});

				sliderPrice.noUiSlider.on('change', function(){
					filterBlock();
				});
			}

			//var defaultFormatter = { 'to': function( value ){
			//	return value !== undefined && String(value).formatCurrency();
			//}, 'from': Number };
			
			step = 5;
			maxLivingsurface = maxLivingsurface ? Math.ceil(maxLivingsurface / step) * step : 0;
			minLivingsurface = minLivingsurface ? Math.floor(minLivingsurface / step) * step : 0;
			if(!setSlider(sliderLivingsurface, minLivingsurface, maxLivingsurface, step))numFilters--;

			if(sliderLivingsurface.noUiSlider){
				sliderLivingsurface.noUiSlider.on('update', function( values, handle ) {
					$('#unit-filter #livingsurface-from').html(Math.round(values[0]) + "m&#178;");
					$('#unit-filter #livingsurface-to').html(Math.round(values[1]) + "m&#178;");
				});

				sliderLivingsurface.noUiSlider.on('change', function(){
					filterBlock();
				});
			}

	        for(var p in select){
				var $e = $('#unit-filter select[name="'+p+'"]');
				$('option', $e).slice(1).remove();
				//$e.empty();
				if(select[p].length>1){
					$e.parent().show();
					//$e.append($('<option>', {value:''})).parent().show();
					select[p].sort(function(a, b){return a - b;});
			        var l = select[p].length;
			        for(i=0; i<l; i++){
			            var t = select[p][i];
			            if(p == 'roomcount') t = select[p][i] + (select[p][i]>1?' of meer':' kamer')
			            $e.append($('<option>', {value:select[p][i]}).text(t));
			        }
		    	}else{
		    		$e.parent().hide();
		    		numFilters--;
		    	}
			}


			//$('#unit-image .zoom').click(function(){
			$('#unit-image').click(function(ev){
				ev.stopImmediatePropagation();
				var items = [];
				var index = 0;
				$('#unit-image img').each(function(i, el){
					var $el = $(el);
					items.push({
						src  : $el.attr('src').replace('.jpg', '_large.jpg'),
						type : 'image'
					});
					if($el.hasClass('active')) index = i;
				});
				if(items.length) $.fancybox.open(items, {}, index);

				//$.fancybox.open({
				//	src  : $('#unit-image img.active').attr('src'),
				//	type : 'image'
				//});

			});
			

			clearFilter();
			filterBlock();

			$('#unit-filter select').niceSelect();



		}

		function showTab(tabElement, targetSelector){
			var $e = $(tabElement);
			if($e.hasClass('active')) return;
			var $a = $e.siblings('.active');
			var firstrun = $a.length == 0;
			$a.removeClass('active');
			$e.addClass('active');
			var $tabs = $e.parent().siblings(targetSelector);
			$tabs.removeClass('lastactive');
			$tabs.filter('.active').addClass('lastactive').removeClass('active').stop().css('opacity', 1);
			var $tab = $tabs.eq($e.index()).addClass('active');
			if(!firstrun)$tab.find('.unit-content').css({'opacity':0}).animate({'opacity':1});
			return $tab;
		}


		function log(key, value){
			var url = './services/?action=log&key='+encodeURIComponent(key)+'&value='+encodeURIComponent(value);
			if(sessionId != undefined)url+='&session_id='+sessionId;		

			$.ajax({
	            url: url,
	            dataType: 'json',
	            success: function(dat){
	               if(dat.session_id) sessionId = dat.session_id;
	               //console.log(dat);
	            },
	            error: function(dat){
	            	//console.log('error', dat.statusText);
	            }
	        });

		}

		function getSvgPos(el, $viewport) {
			var o = el.getBoundingClientRect();
			//var pos = $(el).closest('svg').offset();
			var pos = $viewport.offset();
			var $e =  $(document);
			o.x = o.left - (pos.left - $e.scrollLeft());
			o.y = o.top - (pos.top - $e.scrollTop());
			return o;
		}
		
		function setPointer(button){

			var id = getSVGUnitId(button);
			var $pointer = $('#block-container .pointer');

			if(id){
				var unit = {};
				var i = units.length;
				while(i--){
					if(units[i].id === id){
						unit = units[i];
						break;
					}
				}
	
				if(unit.id){
					$pointer.each(function(i ,el){

						var $el = $(el);
						//var $values = $('[class^="value-"]', $pointer);

						var $viewport = $el.parent();
						$el.stop().css('opacity', 1).attr('data-unit-id', unit.id);


						//if(button){
	
							$('.value-id', $el).html(formatProperty(unit.id, 'id'));


							//var display = $viewport.css('display');
							//$viewport.css('display', 'block');//show viewport to get height of area (height of hidden element is zero)
							$el.removeClass('arrowright arrowleft').addClass('arrowdown');
							var pos = getSvgPos(button, $viewport),
							w = $el.outerWidth(false),
							h = $el.outerHeight(false),
							maxx = $viewport.width() - w + $(document).scrollLeft();
							x = Math.max(0, Math.min(maxx, pos.x + pos.width/2 - w/2)),
							//marginTop = $el.outerHeight(true) - h,
							//miny = -$viewport.offset().top - marginTop,
							miny = 30;	
							y = Math.max(miny, pos.y - h);
							if(y + h > pos.y){
								$el.removeClass('arrowdown').addClass('arrowright');
								y = Math.max(miny, pos.y + pos.height/2 - h/2);
								var marginLeft = $el.outerWidth(true) - w,
								minx = 0 - marginLeft,
								x = Math.max(minx, pos.x - w);
								if(x + w > pos.x){
									x = Math.min(pos.x + pos.width, maxx);
									$el.removeClass('arrowright').addClass('arrowleft');
								}
							}
							$el.css({'left':Math.round(x)+'px', 'top':Math.round(y)+'px'});
							$el.fadeIn(200);
							//$viewport.css('display', display);
						//}else $el.stop().hide();//changed 30.10.2020
					});
				}
			}
		}

		function setIframeHeight(){

			if(window.parent){

	      		//var h = Math.ceil($('#container').outerHeight());
				
				var h = Math.ceil($('#unit-filter:visible').outerHeight()||0);
				var bh = 0;		
				var $e = $('#block-container:visible');
				if($e.length){
					bh = $e.outerHeight();// + $('#block-container .unit-selector.active').outerHeight();
				}
				var uh = $('#unit-container:visible').outerHeight()||0;
				h += Math.ceil(Math.max(bh, uh));

				if(iframeHeight !== h){
					iframeHeight = h;
					clearTimeout(iframeTimer);
					iframeTimer = setTimeout(function(){
//console.log(iframeHeight);						
						parent.postMessage(iframeHeight, '*');
					}, 100);
				}
			}
		}


		function filterBlock(){

			var f = [
				'price-from',
				'price-to',
				'livingsurface-from',
				'livingsurface-to',
				//'block',
				//'type',
				//'location',
				'name',
				'level',
				'roomcount',
				'status'
			];
			var results = $.extend(true, [], units);
			var prices = sliderPrice.noUiSlider ? sliderPrice.noUiSlider.get() : [0,0];
			var livingsurfaces = sliderLivingsurface.noUiSlider ? sliderLivingsurface.noUiSlider.get() : [0,0];
			
			var hasFilter = false;
			var hasPriceFilter = false;    
	        var i = f.length;
	        while(i--){

	            var name = f[i];
	            var val;
	            var b;
	            switch(name){
	                case 'price-from':
						val = prices[0];
						b = val != (sliderPrice.noUiSlider ? sliderPrice.noUiSlider.options.range.min[0] : 0);
						if(b){
							hasFilter = b;
							hasPriceFilter = b;
	               		}
	                   break;
	                case 'price-to':
						val = prices[1];
	                    b =  val != (sliderPrice.noUiSlider ? sliderPrice.noUiSlider.options.range.max[0] : 0);
	                    if(b){
	                    	hasFilter = b;
	                    	hasPriceFilter = b;
	                    }
	                   break;
	                case 'livingsurface-from':
	                   val = livingsurfaces[0];
	                   if(!hasFilter) hasFilter = val != (sliderLivingsurface.noUiSlider ? sliderLivingsurface.noUiSlider.options.range.min[0] : 0);
	                   break;
	                case 'livingsurface-to':
	                   val = livingsurfaces[1];
	                   if(!hasFilter) hasFilter = val != (sliderLivingsurface.noUiSlider ? sliderLivingsurface.noUiSlider.options.range.max[0] : 0);
	                   break;
	                default:
	                    val = $('#unit-filter [name="'+name+'"]').val();
	                    if(val!=undefined && !hasFilter) hasFilter = val.length > 0;
	            }
 
	            if(val && val.length){
		                 
	                var j = results.length;
	                while(j--){
	                    var include = false;
	                    switch(name){
	                        case 'livingsurface-from':
	                            include = results[j].livingsurface >= parseFloat(val);
	                            break;
	                        case 'livingsurface-to':
	                            include = results[j].livingsurface <= parseFloat(val);
	                            break;
	                        case 'price-from': 
	                            if(results[j].price ==0) include = true;//include = !hasPriceFilter;
	                            else include = results[j].price >= parseFloat(val);
	                            break;
	                        case 'price-to':
	                            if(results[j].price ==0) include = true;//include = !hasPriceFilter;
	                            else include = results[j].price <= parseFloat(val);
	                            break;
	                       case 'roomcount':
	                            val = parseInt(val)||0;
	                            if(val == 1) include = results[j].roomcount == val;
	                            else include = results[j].roomcount >= val;
	                            break;
	                       case 'level':
	                            var l = results[j].level;
	                            if(!$.isArray(l))l = [l];
	                            include = l.indexOf(val)>=0;
	                            break;
	                        default:
	                           include = results[j][name] === val;
	                    }
                 
	                    if(!include){
	                        results.splice(j, 1);
	                    }
	                }
	            }
	        }
		
			clearFilterResults();

			var clearActiveUnit = false;

			if(hasFilter){
	            clearActiveUnit = true;
	            var selectboxes = {'name':[], 'roomcount':{}, 'level': {}, 'status':{}};
	            for(var n in selectboxes){
	                selectboxes[n].$element = $('#unit-filter select[name="'+n+'"]');
	                selectboxes[n].hasValue = selectboxes[n].$element.val() != '';
	                selectboxes[n].values = [];
	            }

	
	            $('#unit-list li[data-id]').addClass('hide');

	            i = results.length;
	            if(i == 0){
	               $('#filter-message').show();
	            }else{
	               while(i--){
	                   // $('#wwzr-page.house_selector g[id="'+this.buttonPrefix+results[i].id+'"]').addClass('show');          
	                    for(var n in selectboxes){
	                         if(!selectboxes[n].hasValue && selectboxes[n].values.indexOf(String(results[i][n])) == -1) selectboxes[n].values.push(String(results[i][n]));   
	                    }

	                    $('.unit-selector g[id="'+buttonPrefixSvg+results[i].id+'"]').addClass('show');
	                    $('#unit-list li[data-id="'+results[i].id+'"]').removeClass('hide');

	                    if(results[i].id === activeUnitId) clearActiveUnit = false;
	                }
	            }

	            //disable roomcount and status options:
	            //for(var n in selectboxes){
	            //    if(!selectboxes[n].hasValue){
	            //        $('option', selectboxes[n].$element).each(function(){
	            //            if(selectboxes[n].values.indexOf(this.value) == -1) $(this).addClass('disabled');
	            //        });
	            //    } 
	            //}
	        }

	        
			if(clearActiveUnit) selectUnit(false);

			$('#unit-list li.first').removeClass('first');
			$('#unit-list li:not(.hide)').first().addClass('first');

		}

		function clearFilterResults(){

	        $('.unit-selector g[id^="'+buttonPrefixSvg+'"]').removeClass('show');
	        //$('#unit-filter select option').removeClass('disabled');

	        $('#unit-list li.hide').removeClass('hide');
	        $('#unit-list li.first').removeClass('first');
			$('#unit-list li:not(.hide)').first().addClass('first');
	        $('#filter-message').hide();
	    }
		function clearFilter(){


			//$('#unit-filter #search-results tbody').html('');
			//$(selector + ' #search-results').hide();
			
	 		$('#unit-filter select').val('');
	        //$('#unit-filter option').removeClass('disabled');

	        //var s= sliderPrice.noUiSlider;
	        //s.set([s.options.range.min[0], s.options.range.max[0]]);
	       //
	        //s = sliderLivingsurface.noUiSlider;
	        //s.set([s.options.range.min[0], s.options.range.max[0]]);
	        
	       
	        if(sliderLivingsurface.noUiSlider) sliderLivingsurface.noUiSlider.reset();
	        if(sliderPrice.noUiSlider) sliderPrice.noUiSlider.reset();

	        $('#unit-filter select').niceSelect('update');
        	

		}
		function formatClassName(val){
			return (val||'').toLowerCase().split('/').join('').split(' ').join('-')
		}
		function formatProperty(val, prop){
			if(val == undefined) return '';
			switch(prop){
				case 'id':
					//val = ('0'+parseInt(val, 10)).slice(-3);
					val  = '#'+val;
					break;

				case 'livingsurface':
				case 'terrace':
				case 'garden':
				case 'roofgarden':
				case 'storage':
				case 'volume':
					val = String(val);
					if(val.length){
						if($.isNumeric(val)) val = String(Math.floor(val)).formatNumber(0);
						if(prop === 'volume') val += ' m&#179;';
						else val += ' m&#178;';
					}
					break;
				case 'price':
				case 'price_from':
				case 'price_to':
					if($.isNumeric(val) && val >0) val = String(Math.floor(val)).formatCurrency(true)+' <span>v.o.n.</span>';
					else val = 'prijs op aanvraag';
					break;
				case 'status':
					if(val.length) val = val.charAt(0).toUpperCase() + val.slice(1);
					break;
				case 'level':
					if(!$.isArray(val)) val = [val];
					//$('.unit-level-num').text(val.length);
					if(val.length > 2)val = val[0] + ' t/m ' + val[val.length-1];
					else if(val.length == 2) val = val.join(' en ');
					else val = val.join(', ');
					break;
			}
			return String(val);
		}

		function setSlider(element, min, max, step){
			max = max ? Math.ceil(max / step) * step : 0;
			min = min ? Math.floor(min / step) * step : 0;
			if(min == max){
				$(element.parentNode).hide();
				return false;
			}else{
				$(element.parentNode).show();
				if(element.noUiSlider)element.noUiSlider.destroy();
				noUiSlider.create(element, {
					start: [ min, max ],
					step: step,
					connect: true,
					range: {
						'min': [ min ],
						'max': [ max ]
					}
				});
				//element.noUiSlider.updateOptions({start:[min, max], step:step, range:{'min':[ min ], 'max':[ max ]}}, true);
				return true;
			}
		}



		function selectUnit(id){

			//if(activeUnitId == id) return;

			activeUnitId = false;
			$('#unit-info [class^="unit-"]').parent().removeClass('hide');
			$('#unit-form-btn, #unit-contact-btn').addClass('btn-disabled');
			$('.unit-selector g[id^="'+buttonPrefixSvg+'"].active').removeClass('active');
			$('#unit-image img').remove();
			$('#unit-image .tabbar').empty();
			$('#unit-image .zoom').hide();
			$('#unit-info .unit-status').attr('data-status', null);


			var numUnits = units.length;
			for(var i =0; i<numUnits; i++){
				var active = units[i].active;

				if(units[i].id === id) units[i].active = true;
				else if(units[i].active) units[i].active = false;


				if(units[i].active){
					activeUnitId = units[i].id;
					for(var prop in units[i]){
						var val = formatProperty(units[i][prop], prop)||'';
						//if(prop === 'price'){
						//	if(units[i]['price_screen'] != undefined){
						//		val = formatProperty(units[i]['price_screen'], 'price_screen');
						//	}
						//}
						
						var $e = $('#unit-info .unit-'+prop).html(val);
						if(val.length == 0){
							$e.parent().addClass('hide');
						}
					}
					if($('#unit-info .rows .row:not(.hide)').length % 2){
						$('#unit-info .rows .row.dummy').addClass('hide');
					}

					//images
					$('#unit-image .zoom').show();
					var img = units[i].images;
					var num = img.length;
					for(var j=0;j<num;j++){
						$('#unit-image').append('<img id="unit-image-'+j+'" src="./img/'+img[j]+'" width="600" height="450">');
						if(num>1) $('#unit-image .tabbar').append('<li data-index="'+j+'">'+(j+1)+'</li>');
					}
					if(num>1){
						$('#unit-image .tabbar li').click(function(ev){
							ev.stopImmediatePropagation();
							showTab(this, 'img');
							//$('#unit-image .tabbar li.active').removeClass('active');
							//var idx = $(this).addClass('active').data('index');
							//$('#unit-image img').removeClass('active');
							//$('#unit-image img#unit-image-'+idx).addClass('active');
						}).eq(0).click();
					}else{
						$('#unit-image img').addClass('active');
					}

					$('#unit-info .unit-status').attr('data-status', formatClassName(units[i].status));

					$('#unit-form-btn').attr('href', units[i].url);
					$('#unit-form-btn, #unit-contact-btn').removeClass('btn-disabled placeholder');
				
					$('.unit-selector g[id^="'+buttonPrefixSvg+activeUnitId+'"]').addClass('active');

					
				}
			}

			if(activeUnitId){
				$('#container').attr('unit-id', activeUnitId);
				//$('#navigation li').removeClass('active').filter('[data-category="unit"]').addClass('active').text('Unit #'+formatProperty(unitId, 'id'));
				//location = '#unit-'+unitId;

				//$('#unit-container').css('min-height', minHeight);

				$('#unit-info').show();
				$('#unit-list').hide();

				log('houseid', activeUnitId);

				$('#container').removeClass('animation');

			}else{

				$('#container').removeAttr('unit-id');

				$('#unit-info').hide();
				$('#unit-list').show();
			}
			setIframeHeight();
		}
		
		function onMouseOverlist(event){
			$('.unit-selector.active svg g[id="'+buttonPrefixSvg+event.currentTarget.dataset.id+'"]').addClass('hover');
		}
		function onMouseOutlist(event){
			$('.unit-selector.active svg g[id="'+buttonPrefixSvg+event.currentTarget.dataset.id+'"]').removeClass('hover');
		}	

		function onMouseOverSVG(event){
			//clearTimeout(mouseoverid);
			//$('#situatie-unitid').text(parseInt(event.currentTarget.id.substr(buttonPrefixSvg.length).split('.')[0], 10)).show();
			$(event.currentTarget).addClass('hover').closest('div').addClass('hover');
			//var rect = event.currentTarget.getBoundingClientRect();
			//var off = $el.closest('#level-container').offset();
			//$('#situatie-unitid').css('left', Math.max(0, rect.left - off.left + rect.width/2));

			$('#unit-list li[data-id="'+getSVGUnitId(event.currentTarget)+'"]').addClass('hover');
			

			setPointer(event.currentTarget);
		}
		function onMouseOutSVG(event){
			//mouseoverid = setTimeout(function(){
				
				//var $e = $('svg g#l'+$('#level-nav li.active').data('index') + ' g.active');
				//if($e.length) $e.mouseenter();
				//else 
					//$('#situatie-unitid').hide();
			//}, 500);
			$(event.currentTarget).removeClass('hover').closest('div').removeClass('hover');

			$('#unit-list li[data-id="'+getSVGUnitId(event.currentTarget)+'"]').removeClass('hover');
			
			$('#block-container .pointer').hide();
		}
		function onClickSVG(event){
			//selectUnit(event.currentTarget.id.substr(buttonPrefixSvg.length).split('.')[0]);//!$e.hasClass('active')
			event.stopImmediatePropagation();//stop hover event on touchscreen

			selectUnit(getSVGUnitId(event.currentTarget));
		}
		function getSVGUnitId(button){
			return button.id.substr(buttonPrefixSvg.length)
		}

})();