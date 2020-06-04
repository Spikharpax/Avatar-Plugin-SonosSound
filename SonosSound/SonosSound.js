// Ce qui crée le tabelau de commande
// plus d'infos: https://github.com/cytoscape/cytoscape.js-cxtmenu
let cxtmenu;
// Lib Avatar
// Toutes les fonctions détaillées dans SonosSound\node_modules\cyto-avatar\lib\cyto-avatar.js
const {Graph} = require('cyto-avatar');
const cron = require('cron').CronJob;

let cyto;
let CY;
let cytoscape;
let menu;
let volume;
let destroyMenu;

function addCytoMenu (elem) {
	if (elem.hasClass('SonosSound') && menu == null) {
			// Création du menu,
			// Le tableau est créé par le nombre de commands.
			// Couleur de base
			let fillColorClassic = 'rgba(33, 189, 242, 0.75)';
			// Couleur sélectionné
			let fillColorCurrent = volume ? 'rgba(228, 37, 84, 0.75)' : fillColorClassic;
			let defaults = {
			  menuRadius: 100, // the radius of the circular menu in pixels
			  selector: 'node',
			  commands: [ // an array of commands to list in the menu or a function that returns the array
					{
						content: '90',
						fillColor: ((volume && volume >= 90) ? fillColorCurrent : fillColorClassic),
						select: function(ele){
							setSpeakerVolume('90');
							menu.destroy();
							menu = null;
						}
					},
					{
						content: '80',
						fillColor: ((volume && volume >= 80 && volume < 90) ? fillColorCurrent : fillColorClassic),
						select: function(ele){
							setSpeakerVolume('80');
							menu.destroy();
							menu = null;
						}
					},
					{
							content: '70',
							fillColor: ((volume && volume >= 70 && volume < 80) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								setSpeakerVolume('70');
								menu.destroy();
								menu = null;
							}
					},
					{
						content: '60',
						fillColor: ((volume && volume >= 60 && volume < 70) ? fillColorCurrent : fillColorClassic),
						select: function(ele){
							setSpeakerVolume('60');
							menu.destroy();
							menu = null;
						}
					},
					{
						content: '50',
						fillColor: ((volume && volume >= 50 && volume < 60) ? fillColorCurrent : fillColorClassic),
						select: function(ele){
							setSpeakerVolume('50');
							menu.destroy();
							menu = null;
						}
					},
					{
						content: '40',
						fillColor: ((volume && volume >= 40 && volume < 50) ? fillColorCurrent : fillColorClassic),
						select: function(ele){
							setSpeakerVolume('40');
							menu.destroy();
							menu = null;
						}
					},
					{
						content: '30',
						fillColor: ((volume && volume >= 30 && volume < 40) ? fillColorCurrent : fillColorClassic),
						select: function(ele){
							setSpeakerVolume('30');
							menu.destroy();
							menu = null;
						}
					},
					{
						content: '20',
						fillColor: ((volume && volume >= 20 && volume < 30) ? fillColorCurrent : fillColorClassic),
						select: function(ele){
							setSpeakerVolume('20');
							menu.destroy();
							menu = null;
						}
					},
					{
							content: '15',
							fillColor: ((volume && volume >= 15 && volume < 20) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								setSpeakerVolume('15');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '10',
							fillColor: ((volume && volume >= 10 && volume < 15) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								setSpeakerVolume('10');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '5',
							fillColor: ((volume && volume >= 5 && volume < 10) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								setSpeakerVolume('5');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '<img src="../core/plugins/SonosSound/assets/images/whiteMute.png" alt="mute" width="30%" height="30%"/>',
							fillColor: ((volume && volume < 5) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								setSpeakerVolume('0');
								menu.destroy();
								menu = null;
							}
					}
			  ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
				fillColor: 'rgba(33, 189, 242, 0.75)', // the background colour of the menu
			  activeFillColor: 'rgba(3, 109, 144, 0.75)', // the colour used to indicate the selected command
			  activePadding: 0, // additional size in pixels for the active command
			  indicatorSize: 18, // the size in pixels of the pointer to the active command
			  separatorWidth: 0, // the empty spacing in pixels between successive commands
			  spotlightPadding: 0, // extra spacing in pixels between the element and the spotlight
			  minSpotlightRadius: 12, // the minimum radius in pixels of the spotlight
			  maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
			  openMenuEvents: 'tap', // space-separated cytoscape events that will open the menu; only `tap` work here
			  itemColor: 'white', // the colour of text in the command's content
			  itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
			  zIndex: 9999, // the z-index of the ui div
			  atMouse: false // draw menu at mouse position
			};
			// Création du menu
			menu = CY.cxtmenu(defaults);
			destroy_menu();

	} else if (menu) {
			menu.destroy();
			menu = null;
	}

}


function destroy_menu() {

  if (destroyMenu) {
    destroyMenu.stop();
    destroyMenu = null;
  }

  let d = new Date();
  
  // 7 secondes pour utiliser le menu avant fermeture automatique
  // Fait pour éviter que le menu soit utilisé dans les autres nodes
  let s = d.getSeconds()+7;  
  d.setSeconds(s);
  destroyMenu = new cron(d, function(done) {
    if (menu) {
      if (menu) menu.destroy();
      menu = null;
      destroyMenu = null;
      return;
    }
  },null, true);

}


// Non documenté mais OBLIGATOIRE !
// Fonction exécutée avant l'affichage des menus contextuels des nodes dans l'interface Avatar
// Ici on supprime le menu créé par 'cytoscape-cxtmenu' sinon tous les nodes auraient le menu
// il est rechargé à chaque instance de addCytoMenu()
exports.beforeNodeMenu  = function(CY, cytoscape) {
	if (menu) {
		menu.destroy();
		menu = null;
	}
}


exports.init = function() {
 setTimeout(function(){
		Avatar.trigger('getSonosVolume',{ client: "Salon", callback: function (data) {
			volume = data;
		}});
	}, 15000);
}


exports.addPluginElements = function(CY_param, cyto_param){

	CY = CY_param;
	cytoscape = cyto_param;
	try {
    cxtmenu = require('cytoscape-cxtmenu');
    cytoscape.use(cxtmenu);
  } catch (err) {}

	cyto = new Graph (CY, __dirname);
	cyto.loadAllGraphElements()
	.then(elems => {
		// Test sur la collection pour ajout d'événements
		if (elems && elems.length > 0) {
			elems.forEach(function(ele) {
				if (ele.hasClass('SonosSound')) {
					cyto.onClick(ele, (evt) => {
								addCytoMenu(evt);
					})
				}
			})
		} else {
			addSoundNode();
		}
	})
	.catch(err => {
		console.log('Error loading Elements', err);
	})

}


exports.onAvatarClose = function(callback){

  // Pour exemple: Sauvegarde seulement les éléments de classe 'SonosSound'
  cyto.saveAllGraphElements("SonosSound")
  .then(() => {
    // Obligatoire,
    // chaine onAvatarClose pour tous les plugins
    callback();
  })
  .catch(err => {
    console.log('Error saving Elements', err)
    // Obligatoire,
    // chaine onAvatarClose pour tous les plugins
    callback();
  })

}



function setSpeakerVolume(value) {
	if (Avatar.exists('SonosPlayer')) {
		Avatar.call('SonosPlayer', {action : {command: 'setVolume', value: value}, client: Config.modules.SonosSound.room});
		volume = value;
	}
}


function addSoundNode () {

      cyto.getGraph()
      .then(cy => cyto.addGraphElement(cy, "SonosSound"))
      .then(elem => cyto.addElementClass(elem, "SonosSound"))
			.then(elem => cyto.addElementImage(elem, __dirname+"/assets/images/bluenode.png"))
      .then(elem => cyto.addElementSize(elem, 45))
      .then(elem => cyto.addElementRenderedPosition(elem, 100, 140))
			.then(elem => cyto.onHoldClick(elem, (evt) => {
			  	addCytoMenu(evt);
			}))
      .catch(err => {
        console.log('err:', err || 'erreur dans la création de l\'élément')
      })

}



exports.action = function(data, callback){

	callback();

}
