
// $('#start-time').selectmenu({
// 	width: 100
// });

// $('.wt-times__link').on('click',function (e) {
// 	e.preventDefault();
// 	var s = $(this).find('select');
// 	s.selectmenu({
// 		select: function( event, ui ) {
// 			console.log(ui.item.value);
// 			s.selectmenu( "destroy" );
// 		},
// 		position: { my : "top", at: "center center" }
// 		// appendTo: '#fortesting'
// 	}).selectmenu("open");
// })

$('.wt-times__select').selectmenu({
	position: { my : "top+15", at: "center center" }
});

$('#task-name').selectmenu();


$(".datepicker").datepicker({
  buttonImage: '/img/icon/icon-more-options.svg',
  buttonImageOnly: true,
  showOn: 'both',
  onSelect : function(dateText, inst){
  		console.log(dateText);
  		console.log(this);
  }
});

$('.wt-dates__link').on('click',function(){
	$(this).find('.datepicker').datepicker('show');
})

$('.module-wt__block').draggable({ handle: ".wt-header__module-title" });