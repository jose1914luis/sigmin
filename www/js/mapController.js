/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global google, ol, map, service */

angular.module('starter.controllers').controller('MapCtrl', function ($rootScope, $ionicHistory, $scope, $location, $state, $stateParams, $route, $templateCache, $http, $ionicPopup) {

    var state = 'INIT';

    var menu = 1;
    var service = "http://www.sigmin.co:8080/geoserver/CMQ/wms";
    var zonas_exc = null;
    var titulos = null;
    var btn4_bol = true;
    var distLayer = null;
    var MAPA = 'SATELLITE';
    var typoStr = '';
    var draw = null;
    var wkt = 'MULTIPOLYGON EMPTY';
    var map = null;

    var source = new ol.source.Vector();
    var gmap;

    var iniciarBotones = function () {
        $scope.icono_5 = 'icon ion-map';
        $scope.icono_4 = 'icon ion-ios-crop-strong';
        $scope.icono_3 = 'icon ion-ios-location';
        $scope.centroIcono = 'icon ion-plus';
        $scope.mostrar2 = false;
        $scope.mostrar = false;
        menu = 1;
    };

    iniciarBotones();
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
            iniciarBotones();

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
            $scope.icono_4 = 'ion-ios-circle-filled';
            $scope.icono_3 = 'ion-pin';
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

            if (distLayer == null) {
                distLayer = new ol.layer.Tile({
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
                map.addLayer(distLayer);
            } else {

                map.removeLayer(distLayer);
                distLayer = null;
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

    var vectorPunto = new ol.layer.Vector();

    var instanciarMapa = function () {

        gmap = new google.maps.Map(document.getElementById('gmap'), {
            disableDefaultUI: true,
            keyboardShortcuts: false,
            draggable: true,
            disableDoubleClickZoom: false,
            scrollwheel: true,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        });

        map = new ol.Map({
            layers: [vector, vectorDibujo, vectorPunto],
            interactions: ol.interaction.defaults({doubleClickZoom: false, DragRotate: false, DragRotateAndZoom: false}),
            target: olMapDiv,
            view: view
        });

        map.on('dblclick', function (evt) {

            var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            var point = 'point(' + lonlat[0] + ' ' + lonlat[1] + ')';

            $http({
                method: 'GET',
                url: 'http://www.sigmin.co/finderaccount/Services/sgm_service_identify.php',
                params: {'mbl_coords': point},
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {

                $state.go('app.identify',
                        {
                            list: angular.toJson(response.data)
                        }
                );

            }, function errorCallback(response) {

                $ionicPopup.alert({
                    title: 'Falla de acceso!',
                    template: 'Error de comunicacion, revise su conexion'
                });
            });
        });
    };

    var reinsertarMapa = function () {

        olMapDiv.parentNode.removeChild(olMapDiv);
        gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
    };

    if ($stateParams.placa != undefined && $stateParams.placa != "") {

//        $route.reload();
//        $templateCache.removeAll();
//        $ionicHistory.clearCache();
//        $state.go('app.playlists', {placa: placa[0]}, {reload: true});


        $http({
            method: 'GET', //sgm_service_point.php
            url: 'http://www.sigmin.co/finderaccount/Services/sgm_service_placa.php',
            params: {'placa': $stateParams.placa},
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function successCallback(response) {

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
            instanciarMapa();
            map.getView().fit(extent, map.getSize());
            reinsertarMapa();

//            if ($stateParams.menu != undefined && $stateParams.menu != "") {
//                menu = $stateParams.menu;
//                $scope.cambiarMapa();
//            }


        }, function errorCallback(response) {

            $ionicPopup.alert({
                title: 'Falla de acceso!',
                template: 'Error de comunicacion, revise su conexion'
            });
        });
    } else if ($stateParams.zona != '0' && $stateParams.radio != undefined && $stateParams.radio != "" && $stateParams.coorX != undefined && $stateParams.coorX != "" && $stateParams.coorY != undefined && $stateParams.coorY != "") {

        $http({
            method: 'GET',
            url: 'http://www.sigmin.co/finderaccount/Services/sgm_service_point.php',
            params: {'mbl_coords': 'point(' + $stateParams.coorX + ' ' + $stateParams.coorY + ')', 'mbl_origen': String($stateParams.zona)},
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function successCallback(response) {

            var puntos = String(response.data.coordenada);
            puntos = puntos.replace("POINT(", "");
            puntos = puntos.replace(")", "");
            var puntox = puntos.split(" ")[0];
            var puntoy = puntos.split(" ")[1];

            var circle = new ol.geom.Circle(ol.proj.transform([parseFloat(puntox), parseFloat(puntoy)], 'EPSG:4326', 'EPSG:3857'), parseInt($stateParams.radio));

            var CircleFeature = new ol.Feature(circle);


            var vectorSource = new ol.source.Vector({
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            vectorSource.addFeatures([CircleFeature]);

            var extent = CircleFeature.getGeometry().getExtent();

            vectorPunto = new ol.layer.Vector({
                source: vectorSource,
                style: [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'blue',
                            width: 3
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(0, 0, 255, 0.1)'
                        }),
                        radius: 5
                    })]
            });

            instanciarMapa();

            map.getView().fit(extent, map.getSize());

            reinsertarMapa();


        }, function errorCallback(response) {

            $ionicPopup.alert({
                title: 'Falla de acceso!',
                template: 'Error de comunicacion, revise su conexion'
            });
        });



    } else {

        instanciarMapa();

        gmap.setCenter(new google.maps.LatLng('6.25468647083332', '-74.5981636036184'));
        gmap.setZoom(7);

        reinsertarMapa();
    }

});
