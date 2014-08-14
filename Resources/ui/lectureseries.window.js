exports.create = function() {
	var options = arguments[0] || {};
	var self = require('modules/l2g').create();
	self.actind = Ti.UI.createActivityIndicator({
		style : Ti.UI.ActivityIndicatorStyle.BIG,
		message : 'Ich besorge es Dir …'
	});
	self.add(self.actind);
	self.actind.show();
	self.listview = Ti.UI.createListView({
		templates : {
			'row' : require('ui/TEMPLATES').videorow,
		},
		defaultItemTemplate : 'row'
	});
	self.add(self.listview);
	self.update = function() {
		Ti.App.Lecture2Go.getLectureseriesByTreeId({
			id : options.id,
			onload : function(_data) {
				
				var data = [];
				for (var i = 0; i < _data.lectureseries.length; i++) {
					var item = {
						title : {
							text : _data.lectureseries[i].name
						},
						subtitle : {
							text : _data.lectureseries[i].instructors
						},
						thumb : {
							image : _data.lectureseries[i].thumb
						},
						properties : {
							itemId : JSON.stringify({
								id : _data.lectureseries[i].lectureseriesid,
								title : _data.lectureseries[i].name,
								channel : _data.lectureseries[i]
							}),
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
						}
					};
					data.push(item);
				}
				var section = Ti.UI.createListSection();
				section.setItems(data);
				self.listview.sections = [section];
				self.actind.hide();
			}
		});
	};
	self.listview.addEventListener('itemclick', function(_e) {
		var win = require('ui/videolist.window').create({
			key : 'lectureseries',
			value : JSON.parse(_e.itemId).id,
			title : 'Videos der Vorlesungsreihe',
			subtitle : JSON.parse(_e.itemId).title,
			channel : JSON.parse(_e.itemId).channel,
		}).open();
	});

	self.addEventListener('open', function() {
		setTimeout(self.update, 30);
		if (Ti.Android) {
			var activity = self.getActivity();
			if (activity.actionBar) {
				activity.actionBar.setDisplayHomeAsUp(true);
				activity.actionBar.onHomeIconItemSelected = function() {
					self.close();
				};
			}
		}
	});
	return self;
};
var TESTDATA = [{
	"name" : "F.1 - Rechtswissenschaft",
	"subs" : [{
		"74" : "Institut für Recht & Ökonomik"
	}, {
		"114" : "Rechtswissenschaft"
	}]
}, {
	"name" : "F.2 - Wirtschafts- und Sozialwissenschaften",
	"subs" : [{
		"11" : "Volkswirtschaftslehre (VWL)"
	}, {
		"12" : "Sozialökonomie"
	}, {
		"108" : "Sozialwissenschaften"
	}, {
		"109" : "Betriebswirtschaftslehre (BWL)"
	}, {
		"169" : "fachbereichübergreifend"
	}]
}, {
	"name" : "F.3 - Medizin",
	"subs" : [{
		"72" : "Sexualforschung und Forensische Psychiatrie"
	}, {
		"128" : "Psychosomatische Medizin und Psychotherapie"
	}, {
		"164" : "SFB 936"
	}]
}, {
	"name" : "F.4 - Erziehungswiss., Psychologie, Bewegungswiss.",
	"subs" : [{
		"13" : "Erziehungswissenschaft"
	}, {
		"14" : "Psychologie"
	}, {
		"15" : "Bewegungswissenschaft"
	}, {
		"58" : "Ringvorlesungen"
	}, {
		"67" : "Arbeitsbereich Sozialpsychologie"
	}, {
		"159" : "Studienbereich ABK"
	}, {
		"165" : "Zentrum für Schlüsselkompetenzen / ABK"
	}, {
		"192" : "Akademie der Weltreligionen"
	}]
}, {
	"name" : "F.5 - Geisteswissenschaften",
	"subs" : [{
		"17" : "Sprache, Literatur, Medien (SLM I + II)"
	}, {
		"65" : "Philosophie"
	}, {
		"106" : "Geschichte"
	}, {
		"147" : "Kulturgeschichte und Kulturkunde"
	}, {
		"198" : "Forschungsstelle für Zeitgeschichte in Hamburg"
	}]
}, {
	"name" : "F.6 - Mathematik, Informatik, Naturwissenschaften",
	"subs" : [{
		"24" : "Chemie"
	}, {
		"26" : "Informatik"
	}, {
		"42" : "ZNF"
	}, {
		"57" : "Geowissenschaften"
	}, {
		"61" : "Physik"
	}, {
		"66" : "Mathematik"
	}, {
		"148" : "Gesundheitswissenschaften"
	}, {
		"182" : "MIN-Fakultät"
	}, {
		"171" : "Biologie"
	}, {
		"199" : "KlimaCampus"
	}]
}, {
	"name" : "Sonstige Einrichtungen der UHH",
	"subs" : [{
		"89" : "Öffentliche Vorlesungen"
	}, {
		"38" : "Medienkompetenzzentrum (MCC)"
	}, {
		"49" : "Hochschulsport"
	}, {
		"62" : "UNI-TV"
	}, {
		"75" : "Über die Universität Hamburg"
	}, {
		"76" : "Kinderuni"
	}, {
		"91" : "Studium und Lehre"
	}, {
		"94" : "Career Center"
	}, {
		"107" : "Konfuzius-Institut"
	}, {
		"124" : "STiNE"
	}, {
		"130" : "Asien-Afrika-Institut"
	}, {
		"135" : "Präsidialverwaltung"
	}, {
		"143" : "Zentrales eLearning-Büro"
	}, {
		"146" : "Campus Center"
	}, {
		"162" : "Studierendenparlament (StuPa)"
	}, {
		"172" : "AStA"
	}, {
		"185" : "Internationales"
	}, {
		"190" : "RRZ Universität Hamburg"
	}, {
		"194" : "Kompetenzzentrum Nachhaltige Universität"
	}]
}, {
	"name" : "Arbeitsstelle für wissenschaftliche Weiterbildung",
	"subs" : [{
		"86" : "Dolmetschen"
	}, {
		"43" : "SFB Mehrsprachigkeit"
	}, {
		"56" : "Ringvorlesungen"
	}, {
		"144" : "Allgemeines Vorlesungswesen"
	}]
}, {
	"name" : "Schulkooperation und Juniorstudium",
	"subs" : [{
		"45" : "Juniorstudium"
	}, {
		"46" : "Was wie wofür studieren?"
	}]
}, {
	"name" : "HAW Hamburg - Fakultät  Life Sciences",
	"subs" : [{
		"87" : "Forschungs- und Transferzentrum"
	}, {
		"53" : "Health Sciences"
	}, {
		"68" : "Ökotrophologie"
	}, {
		"122" : "Medizintechnik"
	}, {
		"183" : "Gesundheitswissenschaften"
	}, {
		"186" : "Wahl Pflicht Orientierung"
	}]
}, {
	"name" : "Universitäts-Gesellschaft Hamburg",
	"subs" : [{
		"71" : "Veranstaltungen"
	}]
}, {
	"name" : "Universität Oldenburg - F.3",
	"subs" : [{
		"96" : "Kunst, Kunstgeschichte und Kunstpädagogik"
	}]
}, {
	"name" : "HAW Hamburg - Fakultät Wirtschaft und Soziales ",
	"subs" : [{
		"100" : "MA International Business and Logistics"
	}, {
		"101" : "BA Außenwirtschaft / Internationales Management"
	}, {
		"110" : "BASA (Soziale Arbeit (Bachelor))"
	}]
}, {
	"name" : "HAW Hamburg - Fakultät Design, Medien, Information",
	"subs" : [{
		"104" : "Gamecity Hamburg"
	}, {
		"129" : "Design"
	}]
}, {
	"name" : "Heinrich-Heine-Universität Düsseldorf",
	"subs" : [{
		"113" : "AVZ"
	}]
}]; 