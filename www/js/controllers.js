angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope, $http, $filter, $ionicModal, $ionicPopup, $timeout, $state, $ionicHistory) {

            $scope.loginData = {};
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $scope.doLogin = function () {

                $state.go('app.playlists');
//                var fecha = $filter('date')(new Date(), 'yyyyMMdd');
//                var code = md5(fecha + '-' + $scope.loginData.username + '-' + md5($scope.loginData.password));
//                var respuesta = md5(md5($scope.loginData.password) + '-' + fecha + '-' + $scope.loginData.username);
//
//                $http({
//                    method: 'GET',
//                    url: 'http://www.sigmin.co/finderaccount/Services/sgm_service_user.php',
//                    params: {'login_user': $scope.loginData.username, verification_code: code},
//                    headers: {
//                        'Content-Type': 'application/x-www-form-urlencoded'
//                    }
//                }).then(function successCallback(response) {
//
//                    if (response.data.estado_acceso == respuesta) {
//
//                        $state.go('app.playlists');
//
//                    } else {
//
//                        $ionicPopup.alert({
//                            title: 'Falla de acceso!',
//                            template: 'Por favor revisa tus credenciales!'
//                        });
//                    }
//
//                }, function errorCallback(response) {
//
//                    $ionicPopup.alert({
//                        title: 'Falla de acceso!',
//                        template: 'Error de comunicacion, revise su conexion'
//                    });
//                });
            };


        })

        .controller('identifyCtrl', function ($scope, $state, $stateParams) {

            $scope.items = [];
            $scope.items.length = 0;
            var objs = JSON.parse($stateParams.list);
            var con = Object.keys(objs).length;

            var gotoPlaylist = function (item) {

                var placa = item.split(":")[1].trim();
                for (var i = 0; i < con - 1; i++) {

                    if (objs[i].placa == placa) {
                        $state.go('app.playlist',
                                {
                                    area_hec: objs[i].area_hec,
                                    estado_juridico: objs[i].estado_juridico,
                                    fecha_radica_inscribe: objs[i].fecha_radica_inscribe,
                                    minerales: objs[i].minerales,
                                    modalidad: objs[i].modalidad,
                                    municipios: objs[i].municipios,
                                    personas: objs[i].personas,
                                    placa: objs[i].placa,
                                    tipo_expediente: objs[i].tipo_expediente
                                }
                        ,
                                {
                                    reload: true
                                }
                        );
                        break;
                    }
                }
            };
           

            for (var i = 0; i < con - 1; i++) {

                $scope.items.push(objs[i].tipo_expediente + ' : ' + objs[i].placa);
            }



            $scope.showData = function (item) {

                gotoPlaylist(item);
            };


        })

        .controller('PlacaCtrl', function ($scope, $state, $stateParams) {

            $scope.area_hec = $stateParams.area_hec;
            $scope.estado_juridico = $stateParams.estado_juridico;
            $scope.fecha_radica_inscribe = $stateParams.fecha_radica_inscribe;
            $scope.minerales = $stateParams.minerales;
            $scope.modalidad = $stateParams.modalidad;
            $scope.municipios = $stateParams.municipios;
            $scope.personas = $stateParams.personas;
            $scope.placa = $stateParams.placa;
            $scope.tipo_expediente = $stateParams.tipo_expediente;
        })
        .controller('SearchCtrl', function ($scope, $http, $state, $ionicHistory) {

            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $scope.ubicarCoor = function (coorX, coorY, radio, zona) {


                $ionicHistory.clearCache();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.playlists', {coorX: coorX, coorY: coorY, radio: radio, placa: '', zona: zona}, {reload: true});
            };
        })

        .controller('BrowserCtrl', function ($scope, $http, $window, $state, $ionicHistory, $ionicPopup) {


            $scope.inputVal = '';
            $scope.items = [];
            $scope.cargarCoor = function (item) {

                $ionicHistory.clearCache();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.playlists', {placa: item}, {reload: true});

            };
            $scope.buscar = function (dato) {

                $scope.items.length = 0;
                $scope.items = [];
                if (dato != '') {


z                    $http({
                        method: 'GET',
                        url: 'http://www.sigmin.co//finder/viewValidaQuery.php',
                        params: {'term': dato},
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function successCallback(response) {

                        var obj = response.data;
                        var log = [];
                        $scope.items.length = 0;
                        angular.forEach(obj, function (value, key) {

                            $scope.items.push(value.value);
                        });
                    }, function errorCallback(response) {

                        $ionicPopup.alert({
                            title: 'Falla de acceso!',
                            template: 'Error de comunicacion, revise su conexion'
                        });
                    });
                }
            };
        });
