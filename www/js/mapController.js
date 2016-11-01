/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('starter.controllers').controller('MapCtrl', function ($rootScope, $ionicHistory, $scope, $location, $state, $stateParams, $route, $templateCache, $http) {

    $ionicHistory.clearCache();
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    $route.reload();
    $templateCache.removeAll();

    var source = new ol.source.Vector();

    var gmap = new google.maps.Map(document.getElementById('gmap'), {
        disableDefaultUI: true,
        keyboardShortcuts: false,
        draggable: false,
        disableDoubleClickZoom: true,
        scrollwheel: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    $scope.icono_5 = 'icon ion-map';
    $scope.icono_4 = 'icon ion-ios-crop-strong';
    $scope.icono_3 = 'icon ion-ios-location';
    $scope.centroIcono = 'icon ion-plus';


//    vector de dibujo
    var vectorDibujo = new ol.layer.Vector({
        name: 'my_vectorlayer',
        source: source,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 1
            })
        })
    });

//se dibuja el radio
    if ($stateParams.placa == '0') {

        var precisionCircle = ol.geom.Polygon.circular(
                /* WGS84 Sphere */
                new ol.Sphere(6378137),
                [-74.5971431341708, 6.5323780468158],
                1000,
                /* Number of verticies */
                64).transform('EPSG:4326', 'EPSG:3857');
        var precisionCircleFeature = new ol.Feature(precisionCircle)

    }

    $scope.buscar = function () {

        $state.go('app.browse');
    };

    function addInteraction() {

        draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ (typoStr)
        });
        map.addInteraction(draw);

    }


    $scope.clickBoton_4 = function () {

        if (menu == 1) {
            if (btn4_bol) {

                btn4_bol = false;
                typoStr = 'Polygon';
                addInteraction();

            } else {
                btn4_bol = true;
                map.removeInteraction(draw);
            }
        } else if (menu == 2) {

            $state.go('app.search');

        } else if (menu == 3) {

            if (zonas_exc == null) {

                zonas_exc = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: service,
                        params: {
                            'LAYERS': 'zonas_excluibles_col',
                            'VERSION': '1.1.1',
                            'FORMAT': 'image/png',
                            'TILED': true
                        }
                    })
                });
                map.addLayer(zonas_exc);

            } else {
                map.removeLayer(zonas_exc);
                zonas_exc = null;
            }
        }
    };


    $scope.mostrarFinder = function () {

        if (menu == 1) {
            $scope.mostrar2 = false;
            $scope.icono_5 = 'icon ion-android-map';
            $scope.icono_4 = 'icon ion-ios-navigate';
            $scope.icono_3 = 'icon ion-android-hand';
            $scope.centroIcono = 'icon ion-ios-location';
            menu = 2;
        } else if (menu == 3) {

            if (titulos == null) {

                titulos = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: service,
                        params: {
                            'LAYERS': 'titulos_col',
                            'VERSION': '1.1.1',
                            'FORMAT': 'image/png',
                            'TILED': true
                        }
                    })
                });
                map.addLayer(titulos);
            } else {
                map.removeLayer(titulos);
                titulos = null;
            }
        }
    };

    $scope.mostrarExp = function () {

        $scope.mostrar2 = false;
        $scope.icono_5 = 'icon ion-bookmark';
        $scope.icono_4 = 'icon ion-alert-circled';
        $scope.icono_3 = 'icon ion-clipboard';
        $scope.centroIcono = 'icon ion-ribbon-b';
        menu = 3;
        $scope.funcion5 = "mostrarTitulos()";
    };

    $scope.mostrarMenu = function () {

        if (menu == 1) {

            if ($scope.mostrar) {

                $scope.mostrar = false;
                $scope.mostrar2 = false;
            } else {
                $scope.mostrar = true;
                $scope.mostrar2 = true;
            }
        } else {

            $scope.mostrar2 = true;
            $scope.icono_5 = 'icon ion-map';
            $scope.icono_4 = 'icon ion-ios-crop-strong';
            $scope.icono_3 = 'icon ion-ios-location';
            $scope.centroIcono = 'icon ion-plus';
            menu = 1;
        }
    };

    $scope.cambiarMapa = function () {

        if (menu == 1) {

            if (MAPA == "SATELLITE") {

                gmap.setMapTypeId(google.maps.MapTypeId.TERRAIN);
                MAPA = 'TERRAIN';
            } else if (MAPA == 'TERRAIN') {

                gmap.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                MAPA = 'SATELLITE';
            }
        } else if (menu == 3) {

            if (districtLayer == null) {
                districtLayer = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: service,
                        params: {
                            'LAYERS': 'solicitudes_col',
                            'VERSION': '1.1.1',
                            'FORMAT': 'image/png',
                            'TILED': true
                        }
                    })
                });
                map.addLayer(districtLayer);
            } else {

                map.removeLayer(districtLayer);
                districtLayer = null;
            }

        }
    };

    var view = new ol.View({
        // make sure the view doesn't go beyond the 22 zoom levels of Google Maps
        center: ol.proj.fromLonLat([-74.5981636036184, 6.25468647083332]),
        zoom: 7,
        maxZoom: 21
    });


    view.on('change:center', function () {
        var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
        gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
    });
    view.on('change:resolution', function () {
        gmap.setZoom(view.getZoom());
    });

    var olMapDiv = document.getElementById('olmap');

    var vector = new ol.layer.Vector({
    });



    if ($stateParams.placa != undefined && $stateParams.placa != "") {

        $http({
            method: 'GET',
            url: 'http://192.168.0.10/finderaccount/Services/sgm_service_placa.php',
            params: {'placa': $stateParams.placa},
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function successCallback(response) {

            console.log(response.data[0]);
            wkt = response.data[0].coordenadas;

            var format = new ol.format.WKT();

            var feature = format.readFeature(wkt, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            vector = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [feature]
                }),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ef473a',
                        width: 3
                    }),
                    text: new ol.style.Text({
                        text: response.data[0].placa,
                        scale: 1.8,
                        fill: new ol.style.Fill({
                            color: 'black'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 2
                        })
                    })
                })
            });

            var extent = feature.getGeometry().getExtent();
            console.log(extent);
            map = new ol.Map({
                layers: [vector, vectorDibujo],
                interactions: ol.interaction.defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false,
                    doubleClickZoom: false
                }).extend([new ol.interaction.DragPan({kinetic: null})]),
                target: olMapDiv,
                view: view
            });

            map.getView().fit(extent, map.getSize());

            map.on('dblclick', function (evt) {
                console.log('doubled');
                var feature = map.forEachFeatureAtPixel(evt.pixel,
                        function (feature, layer) {
                            
                            // si entra aqui es por que tiene datos para mostrar
                            $state.go('app.playlists', {placa: item}, {reload: true});
                        });                        
            });

//            gmap.setCenter(new google.maps.LatLng('6.25468647083332', '-74.5981636036184'));
//            gmap.setZoom(7);


            olMapDiv.parentNode.removeChild(olMapDiv);
            gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);

        }, function errorCallback(response) {

            alert('Error de comunicacion, consulte su WebMaster');
        });
    } else {

        map = new ol.Map({
            layers: [vector, vectorDibujo],
            interactions: ol.interaction.defaults({
                altShiftDragRotate: false,
                dragPan: false,
                rotate: false
            }).extend([new ol.interaction.DragPan({kinetic: null})]),
            target: olMapDiv,
            view: view
        });

        gmap.setCenter(new google.maps.LatLng('6.25468647083332', '-74.5981636036184'));
        gmap.setZoom(7);

        olMapDiv.parentNode.removeChild(olMapDiv);
        gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);


    }

});