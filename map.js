//etkilesim sonucunun kordinatlarini ve bilgisini okumak icin WKT nesnesi olustur
var wkt = new ol.format.WKT()
   var feature, wktString;
   
   //etkilesim icin olusturulacak layer (katman) icin ortak kaynak
   
   const kaynak = new ol.source.Vector();
 
   //map nesnesini olustur ve id si map olan nesne ile degistir.
   var map = new ol.Map({
     target: 'map',
     layers: [
       new ol.layer.Tile({
         source: new ol.source.OSM() //open street map => ucretsiz sokak gorunumu haritasi
       }),
       new ol.layer.Vector({ //vektor layer'ini ekle ve vektorlerin renklerini ayarla
         source: kaynak,
         style: new ol.style.Style({
             fill: new ol.style.Fill({ //polygon icin
                 color: 'rgba(130, 130, 130, 0.4)',
             }),
             stroke: new ol.style.Stroke({ //dis cizgiler icin
                 color: 'green',
                 width: 3,
             }),
             image: new ol.style.Circle({
                 radius: 9, 
                 fill: new ol.style.Fill({ //point icin
                     color: '#eedd88',
                 }),
             }),
           }),
       })
     ],
     view: new ol.View({
       center: ol.proj.fromLonLat([32.53,39.57]), // ankara merkezli ac (ankara en lem ve boylami)
       zoom: 5 //turkiye gorunecek sekilde zoom yap
     })
   });
 
   let draw, snap; // global, böylece onları daha sonra kaldırabiliriz
   const typeSelect = document.getElementById('type');
 
   typeSelect.onchange = function () {
       map.removeInteraction(draw);
       map.removeInteraction(snap);
       EtkilesimiEkle();
       map.un('click', callBack)
   };
    
   function EtkilesimiEkle() {
       draw = new ol.interaction.Draw({
           source: kaynak,
           type: typeSelect.value,
       });
       snap = new ol.interaction.Snap({ source: kaynak });
 
       map.addInteraction(draw);
       map.addInteraction(snap);
       draw.on('drawend', CizimBittiginde);
      
   }
 
   function CizimBittiginde(evt) {
     feature = evt.feature;
     //var x = feature.getGeometry().getCoordinates()
     wktString = wkt.writeFeature(feature);
 
      ModalAc();
   
   }
  
 
   EtkilesimiEkle(); //ilk secili sekil (type) ile etkilesimi ekle (baslat)
    
   