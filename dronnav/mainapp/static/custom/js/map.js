var geoserver = 'http://104.42.192.13/geoserver'
var editLayername, editlayerpgname
var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
      // , new ol.layer.Tile({
      //   source: new ol.source.XYZ({
      //     projection: "EPSG:4326",
      //     url: 'https://dronnavblob.blob.core.windows.net/testingtiff/LayerInfoImpl-5a4cb0ca:1748ae64bfb:-7ff6/EPSG:4326/png/default/{z}/{x}/{-y}.png'
      //   })
      // })
    ],
    target: 'map',
   
    view: new ol.View({
      projection:'EPSG:4326',
      center: [-118.14182720308439, 34.0133883489378],
      zoom: 10
    })
  });
  var editingvectorLayer = new ol.layer.Vector({
    source:  new ol.source.Vector(),
    style:new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0.4)'
        }),
        stroke:  new ol.style.Stroke({
          color: '#3399CC',
          width: 5
        }),
        radius: 5
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.4)'
      }),
      stroke:  new ol.style.Stroke({
        color: '#3399CC',
        width: 5
      })
    }),
    name:'editableLayer',
    zIndex:1000
  });
  map.addLayer(editingvectorLayer)
  $('.dropdown-menu div.dropdown-item').click(function(e) {
    e.stopPropagation();
});

// var editingvectorSource = new ol.source.Vector();

// var editingvectorLayer = new ol.layer.Vector({
//   source: editingvectorSource
// });
// map.addLayer(editingvectorLayer)

var selectedit = new ol.interaction.Select({
  wrapX: false
})
map.addInteraction(selectedit)

var modify = new ol.interaction.Modify({
  features: selectedit.getFeatures()
});
map.addInteraction(modify)
modify.on('modifystart', function(data){
  console.log(data)
})
modify.on('modifyend', function(data){
  console.log(data)
})

function toggleLayer(checkbox){
    value = checkbox.value
    var allval = value.split('|')
    var layerName = allval[0]
    var storeName = allval[1]
    var dbname = allval[3]
    if (!checkbox.checked){
        map.getLayers().a.forEach(function(lyr){
            if(lyr.get('name')){
                if(lyr.get('name') ==  layerName) {
                    map.removeLayer(lyr)
                }
            }
        })
        document.getElementById(checkbox.id+'_card').parentElement.removeChild(document.getElementById(checkbox.id+'_card'))
    }else{
    var wmsSource = new ol.source.ImageWMS({
        url: geoserver + '/geovitics/wms',
        params: {'LAYERS': storeName+':'+layerName},
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
      });

      var wmsLayer = new ol.layer.Image({
        source: wmsSource,
        name:layerName
      });
      map.addLayer(wmsLayer)

      document.getElementById('layerspallete').innerHTML += '<div class="card" id="'+checkbox.id+'_card" style="width: 100%;"><div class="card-body"><h5 class="card-title">'+checkbox.parentElement.getElementsByTagName('label')[0].innerText+'</h5><label class="switch"><input type="checkbox" class="togglecheckbox" onchange="toggleeditcheck(this,\''+layerName+'\',\''+storeName+'\',\''+dbname+'\')"> <span class="slider round"></span></label></div></div>'
      
    
    }
}
function toggleeditcheck(check,layername,storename,dbname){
// var alltogglecheckboxes = document.getElementsByClassName('togglecheckbox')
// alltogglecheckboxes.forEach(check=>{
//   check.checked = false
// })

  if(check.checked){
    var alltogglecheckboxes = document.getElementsByClassName('togglecheckbox')
    for(k=0;k<alltogglecheckboxes.length;k++){
      alltogglecheckboxes[k].checked = false
    }

check.checked = true
     startEdit(layername,storename,dbname)
  } else {
    stopEdit()
  }
}
var selectedLayername,selectedLayer
function startEdit(layername,storename,dbname){
 
  editLayername = layername
  editlayerpgname = dbname
  map.on('singleclick', activateedit);
}


function activateedit(e){
  {
    var alllayers = map.getLayers().a
    for (i=0;i<alllayers.length;i++){
      if (alllayers[i].get('name')){
        if (alllayers[i].get('name') === editLayername){
          wmsSource = alllayers[i].getSource()
        }
      }
    }
    var viewResolution = /** @type {number} */ (map.getView().getResolution());
    var url = wmsSource.getGetFeatureInfoUrl(
        e.coordinate, viewResolution, 'EPSG:4326',
        {'INFO_FORMAT': 'application/json'});
    if (url) {
     $.getJSON(url, function(data){
        console.log(data)
        if(data.features.length > 0){
        editingvectorLayer.getSource().clear()
        editingvectorLayer.getSource().addFeatures((new ol.format.GeoJSON()).readFeatures(data))
        map.on('singleclick', activateedit);
        clickedfeat = data.features[0].properties
        var allkeys = Object.keys(clickedfeat)
    var thead = document.getElementById('head')
    thead.innerHTML = ''
    var tr = document.createElement('tr')
    var td = document.createElement('td')
 td.innerHTML = ' id '
 tr.appendChild(td)
    for(i=0;i<allkeys.length;i++){
      if (allkeys[i] != 'geometry' ){
        var td = document.createElement('td')
        td.innerHTML = allkeys[i]
        tr.appendChild(td)
      }
    }
    var td = document.createElement('td')
 td.innerHTML = ' Actions '
 tr.appendChild(td)
    thead.appendChild(tr)
    var tbody = document.getElementById('tbody')
 tbody.innerHTML = ''
 var tr = document.createElement('tr')
 var td = document.createElement('td')
 td.innerHTML = data.features[0].id.split('.')[1]
 tr.appendChild(td)
 for(i=0;i<allkeys.length;i++){
   if (allkeys[i] != 'geometry'  ){
     var td = document.createElement('td')
     var input = document.createElement('input')
     input.type = 'text'
     if (allkeys[i].includes('id')){
      input.disabled = true
     }
     if(clickedfeat[allkeys[i]]){
      input.setAttribute('value',clickedfeat[allkeys[i]]) 

     }
     input.setAttribute('id',allkeys[i]+'_input') 
     td.appendChild(input)
     tr.appendChild(td)
   }
 }
 var td = document.createElement('td')
 td.innerHTML = ' <button class="btn btn-success" onclick="saveeditedgeom()">Save Edit</button>'
 tr.appendChild(td)
 tbody.appendChild(tr)
        }
      })
    }
  }
}
function stopEdit(){
  map.getLayers().a.forEach(lyr=>{
    if (lyr.get('name')){
      if(lyr.get('name')=== 'editableLayer'){
        lyr.getSource().clear()
      }
    }
  })
}


function saveeditedgeom(){
 var allthead = document.getElementById('head').getElementsByTagName('td')
 var allbody = document.getElementById('tbody').getElementsByTagName('td')

 var script = 'UPDATE spatial.'+editlayerpgname+' SET ' 
 var allcols = ''
  for (i=1;i<(allthead.length-1);i++){
    var val =  allbody[i].getElementsByTagName('input')[0].value
      if(val != '' ){
    if(allcols == ''){
      allcols += '"'+allthead[i].innerHTML+'" = \'' + val.split("'").join("''")+ '\''
    }else {
      allcols += ',"'+allthead[i].innerHTML+'" = \'' + val.split("'").join("''")+ '\''
    }
      }
    // console.log(i)
  }
  script += allcols
  if(selectedit.getFeatures().a.length > 0){
    if (selectedit.getFeatures().a[0].getGeometry().getType() == 'Polygon'){
      var allcoords = selectedit.getFeatures().a[0].getGeometry().getCoordinates()[0]
      var linstringcoods = 'LINESTRING('
      for (j=0;j<allcoords.length;j++){
        if (j==0){
          linstringcoods+= allcoords[j][0]+'  '+allcoords[j][1]
        }else{
        linstringcoods+= ','+allcoords[j][0]+'  '+allcoords[j][1]
        }
      }
      linstringcoods += ')'
script += ", geom =ST_SetSRID(ST_MakePolygon(ST_GeomFromText('"+linstringcoods+"')),Find_SRID('spatial', '"+editlayerpgname+"',  'geom'))"
    } else if (selectedit.getFeatures().a[0].getGeometry().getType() == 'LineString'){
      var allcoords = selectedit.getFeatures().a[0].getGeometry().getCoordinates()
      var linstringcoods = 'ST_MakeLine(ARRAY[ '
      for (j=0;j<allcoords.length;j++){
        if (j==0){
          linstringcoods+= 'ST_MakePoint('+allcoords[j][0]+','+allcoords[j][1]+')'
        }else{
        linstringcoods+= ',ST_MakePoint('+allcoords[j][0]+','+allcoords[j][1]+')'
        }
      }
      linstringcoods += '])'
script += ", geom = ST_SetSRID("+linstringcoods+" ,Find_SRID('spatial', '"+editlayerpgname+"',  'geom'))	"
    }else if (selectedit.getFeatures().a[0].getGeometry().getType() == 'Point'){
      script += " , geom = ST_SetSRID(ST_MakePoint("+selectedit.getFeatures().a[0].getGeometry().getCoordinates()[0]+", "+selectedit.getFeatures().a[0].getGeometry().getCoordinates()[1]+"),Find_SRID('spatial', '"+editlayerpgname+"', 'geom')) "

    }

    
  }
  script +=  ' WHERE id = ' + parseInt(allbody[0].innerText)
 console.log(script)
 $.get("editfeat", { sqlParam: script }, function(data){
   console.log(data)
   Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Feature Information updated',
    showConfirmButton: false,
    width:'15rem',
    timer: 1500
  })
  selectedit.getFeatures().clear()
  editingvectorLayer.getSource().clear()


 })
  
}


