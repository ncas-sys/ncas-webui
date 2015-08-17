module.exports = function($rootScope, ConnectionService){
	var Ps = require('perfect-scrollbar');
	var itemOptionsList = document.getElementById('itemOptionsList');
	Ps.initialize(itemOptionsList, {
		swipePropagation: false,
		suppressScrollX: true
	});
	InterfaceCtrl = this;
	InterfaceCtrl.status = 'offline';
	InterfaceCtrl.showOptions = false;
	InterfaceCtrl.options = [];
	InterfaceCtrl.optionsTitle = null;
	InterfaceCtrl.items = [
		{
			key: 'domes',
			icon: 'fa fa-lightbulb-o ',
			title: 'Dome Lights',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'Turn On',
					'emit': 'DomesOn',
					'icon': 'fa fa-power-off'
				},
				{
					'title': 'Turn Off',
					'emit': 'DomesOff',
					'icon': 'fa fa-power-off'
				}
			]
		},
		{
			key: 'emo',
			icon: 'fa fa-bolt ',
			title: 'Emo Power',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'Turn On',
					'emit': 'EmoOn',
					'icon': 'fa fa-power-off'
				},
				{
					'title': 'Turn Off',
					'emit': 'EmoOff',
					'icon': 'fa fa-power-off'
				}
			]
		},
		{
			key: 'sweeps',
			icon: 'fa fa-asterisk ',
			title: 'Sweep Fans',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'Turn On',
					'emit': 'SweepsOn',
					'icon': 'fa fa-power-off'
				},
				{
					'title': 'Turn Off',
					'emit': 'SweepsOff',
					'icon': 'fa fa-power-off'
				}
			]
		},
		{
			key: 'extractors',
			icon: 'fa fa-arrow-circle-o-up ',
			title: 'Extractors',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'Turn On',
					'emit': 'ExtractorsOn',
					'icon': 'fa fa-power-off'
				},
				{
					'title': 'Turn Off',
					'emit': 'ExtractorsOff',
					'icon': 'fa fa-power-off'
				}
			]
		},
		{
			key: 'lighting',
			icon: 'fa fa-sliders ',
			title: 'Lighting Scenes',
			status: 'not connected',
			class: "none",
			options: [
				{
					'title': 'House Lights',
					'emit': 'LightingScene1',
					'icon': 'fa fa-sliders'
				},
				{
					'title': 'Stage Wash',
					'emit': 'LightingScene2',
					'icon': 'fa fa-sliders'
				},
				{
					'title': 'Black Out',
					'emit': 'LightingScene3',
					'icon': 'fa fa-sliders'
				},
				{
					'title': 'Conference',
					'emit': 'LightingScene6',
					'icon': 'fa fa-sliders'
				}
			]
		}
	]

	InterfaceCtrl.updateMyStatus = function(newStatus){
		InterfaceCtrl.status = newStatus
		$rootScope.$apply();
	}
	InterfaceCtrl.updateItemStatus = function(obj){
		angular.forEach(InterfaceCtrl.items, function(item, i){
			if(item.key==obj.node){
				if(obj.value==1 || obj.value=='On' || obj.value=='ON'){
					InterfaceCtrl.items[i].class='on'
					InterfaceCtrl.items[i].status = 'On'
				}else if(obj.value==0 || obj.value=='Off' || obj.value=='OFF'){
					InterfaceCtrl.items[i].class='off'
					InterfaceCtrl.items[i].status = 'Off'
				}
				$rootScope.$apply()
			}
		})
	}

	InterfaceCtrl.openItemOptions = function(itemKey){
		var item = InterfaceCtrl.items[itemKey]
		InterfaceCtrl.showOptions = true;
		InterfaceCtrl.options = item.options
		InterfaceCtrl.optionsTitle = item.title;
	}

	InterfaceCtrl.sendMsg = function(opt){
		opt.type='command';
		InterfaceCtrl.showOptions = false;
		ConnectionService.sendMsg(opt);
	}


	$rootScope.$on('UpdateMyStatus', function(event, stat){
		InterfaceCtrl.updateMyStatus(stat)
	})

	$rootScope.$on('UpdateState', function(event, obj){
		InterfaceCtrl.updateItemStatus(obj);
	})

}

