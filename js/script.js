let al = null;

function start(show) {
  
  console.log('Starting ...');
  var input = document.getElementById("address");

  var env = document.querySelector("#env").value;
  var user = document.querySelector("#apiUser").value;
  var password = document.querySelector("#password").value;
  var country = document.querySelector("#country").value;
  var moreSources = document.querySelector("#moreSource").value;
  
  
  var enableGroupAddresses = document.querySelector("#groupAddresses").checked;
  var intlGeocode = document.querySelector("#intlGeocode").checked;
  var enableuserInferred = document.querySelector("#userInferred").checked;
  var enablesuppressLot = document.querySelector("#suppressLot").checked;
  var enablefiltupl = document.querySelector("#filtMoreSource").checked;
  var filtAUPOST = "UPL, LPO, CPA, RA, RP";
  console.log(enablefiltupl);
  if (enablefiltupl == false){
    var filtAUPOST = "";
  } 
  //console.log(filtAUPOST);

  // var minLength = document.querySelector('#minLength').value;
  // var hits = document.querySelector('#hits').value;
  // var caseType = document.querySelector('#caseType').value;

  Harmony.useEnv(env);
  
  // Harmony.useProtocol(Harmony.JSONP);

  // Create an api user via the console with domain cdpn.io
  Harmony.init(user, password, Harmony.AUSTRALIA);

  var featureOptions = { exposeAttributes: "1"};


  featureOptions.groupAddresses = enableGroupAddresses ? 1 : 0;
  featureOptions.suppressLot = enablesuppressLot ? 1 : 0;
  featureOptions.userInferred = enableuserInferred ? 1 : 0;
  featureOptions.moreSources= moreSources;
  featureOptions.addressTypeFilter= filtAUPOST;
  
  Harmony.useFeatureOptions(featureOptions);

  // update intlGeocode flag

  var getIntlGeocode = country != "AU" && country != "NZ" && intlGeocode;

  var opt = {
    // optional, min 3 chars to trigger the lookup
    minLength: 3,
    //optional, number of candidates to return from search, default is 20
    hits: 20,
    //optional, case type for the output, default is whatever the case in the sot
    // caseType: caseType,

    // enable Harmony.International.getGeocode for non-AU/NZ countries when address selected.
    getIntlGeocode: getIntlGeocode,


    onSelect: function (ui) {
      console.log("address selected: " + JSON.stringify(ui));
    },

    onRetrieve: function (ui) {
      document.getElementById("json").innerText = JSON.stringify(
        ui.onRetrieveItem,
        null,
        2
      );
    },

    onIntlGeocode: function (ui) {
      console.log(
        "geocode address selected: " + JSON.stringify(ui)
      );
      var jsonEl = document.getElementById("json");
      var orig = jsonEl.innerText + "\n==geocode result==\n";
      jsonEl.innerText = orig + JSON.stringify(ui.onIntlGeocodeItem, null, 2);
    }
  };

  if (al) {
    al.autocomplete.destroy();
    al = null;
  }

  HarmonyJS.addField(
    Harmony.SOURCE_OF_TRUTH,
    document.getElementById("sourceOfTruth")
  );


  al = HarmonyJS.addressLookup(
    input,
    document.getElementById("country"),
    document.getElementById("sourceOfTruth"),
    opt
  );

  //show accordion

    var demoEl = document.getElementById("collapseTwo");
    var demoE2 = document.getElementById("demo");
    var setEl = document.getElementById("collapseOne");
    var setE2 = document.getElementById("settings");
    
    demoE2.setAttribute("class", "accordion-item visible");
    setE2.setAttribute("class", "accordion-item visible");
    setEl.setAttribute("class", "accordion-collapse collapse show");
    demoEl.setAttribute("class", "accordion-collapse collapse show");
  


  return false;
}

const countryEl = document.getElementById('country');
const sotEl = document.getElementById('sourceOfTruth');


function updateSot (e) {
  if (e.target == countryEl) {
    const countryVal = countryEl.value;
    if (countryVal == 'AU') {
      sotEl.value = 'GNAF';
      sotEl.style.display = "block";
    } else if (countryVal == 'NZ') {
      sotEl.value = 'NZAD';
      sotEl.style.display = "block";
    } else {
      sotEl.style.display = "none";
    }
  }
  
  updateCheckboxes();
};


function updateCheckboxes() {
  const countryVal = countryEl.value;
  const sotVal = sotEl.value;

  // disable groupAddresses
  const groupAddressesEl = document.getElementById('groupAddresses')
  if (countryVal=='NZ' || (countryVal=='AU' && sotVal=='AUSOTS')) {
    groupAddressesEl.checked = false;
    groupAddressesEl.disabled = true;
  } else {
    groupAddressesEl.disabled = false;
  }
  
  // disable intlGeocode
  const intlGeocodeEl = document.getElementById('intlGeocode');
  if (countryVal=='AU' || countryVal=='NZ') {
    intlGeocodeEl.checked = false;
    intlGeocodeEl.disabled = true;
  } else {
    intlGeocodeEl.disabled = false;
  }
}

document.getElementById('start').onclick = function(e) {
  updateSot(e);
  return start(true);
};

const matchedEls = document.querySelectorAll(".address-opt");
matchedEls.forEach((e) =>
  e.addEventListener("change", (event) => {
    updateSot(event);
    start(false);
  })
);

