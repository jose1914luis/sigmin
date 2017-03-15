angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope, $http, $filter, $ionicPopup, $state, $ionicHistory, $ionicSideMenuDelegate) {

//            $scope.$on('$ionicView.enter', function () {
//                $ionicSideMenuDelegate.canDragContent(false);
//            });
//            $scope.$on('$ionicView.leave', function () {
//                $ionicSideMenuDelegate.canDragContent(true);
//            });

            $scope.loginData = {};


            $scope.crearCuenta = function () {

                $state.go('app.cuenta');
            };

            $scope.doLogin = function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                var fecha = $filter('date')(new Date(), 'yyyyMMdd');
                var code = md5(fecha + '-' + $scope.loginData.username + '-' + md5($scope.loginData.password));
                var respuesta = md5(md5($scope.loginData.password) + '-' + fecha + '-' + $scope.loginData.username);

                $http({
                    method: 'GET',
                    url: 'http://www.sigmin.co/finderaccount/Services/sgm_service_user.php',
                    params: {'login_user': $scope.loginData.username, verification_code: code},
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function successCallback(response) {

                    if (response.data.estado_acceso == respuesta) {

                        $state.go('app.playlists');

                    } else {

                        $ionicPopup.alert({
                            title: 'Falla de acceso!',
                            template: 'Por favor revisa tus credenciales!'
                        });
                    }

                }, function errorCallback(response) {

                    $ionicPopup.alert({
                        title: 'Falla de acceso!',
                        template: 'Error de comunicacion, revise su conexion'
                    });
                });
            };


        })

        .controller('cuentaCtrl', function ($scope, $state, $window, $ionicModal, $ionicHistory, $http, $ionicPopup, $timeout) {

            $scope.crear = {};
            $scope.crear.pass1 = '';
            $scope.crear.pass2 = '';
            $scope.crear.nombre = '';
            $scope.cargar = false;

            focus = function (id) {                
                $timeout(function () {
                    var element = $window.document.getElementById(id);
                    if (element)
                        element.focus();
                });
            };

            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;                    
            });
            
            $scope.openModal  = function (){
                $scope.modal.show();
            };

            $scope.crearCuenta = function () {                

                if (validarDatos()) {
                    $scope.cargar = true;
                    
                    $http({
                        method: 'GET',
                        url: 'http://sigmin.co/Services/sgm_service_crear_cuenta.php',
                        params: {'txtNombre': $scope.crear.nombre, 'txtEmail': $scope.crear.email,
                            'txtDocumento': $scope.crear.doc, 'txtPassword': $scope.crear.pass1,
                            'txtPassword2': $scope.crear.pass2},
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function successCallback(response) {
                        
                        $scope.cargar = false;
                        var resp = String(response.data).trim();

                        if (resp == "1") {

                            $scope.openModal();                           

                        } else {

                            $ionicPopup.alert({
                                title: 'Falla!!!',
                                template: 'Hubo un error al registrar el usuario, intente nuevamente.'
                            });
                        }
                    }, function errorCallback(e) {

                        $ionicPopup.alert({
                            title: 'Falla de acceso!',
                            template: 'Error de comunicacion, revise su conexion'
                        });
                    });
                }

            };


            validarDatos = function () {

                var patron = /^(\d){5,15}$/;

                if (String($scope.crear.doc).search(patron) < 0) {

                    $ionicPopup.alert({
                        title: 'Alerta!',
                        template: 'El número de documento debe ser numerico y no inferior a 5 caracteres'
                    }).then(function () {
                        focus('doc');
                    });

                    return false;
                }

                // validacion del nombre de la persona:
                patron = /[A-Za-z]{3,}/;
                if (String($scope.crear.nombre).search(patron) < 0 || String($scope.crear.nombre).length < 6) {

                    $ionicPopup.alert({
                        title: 'Alerta!',
                        template: "'Nombre' no debe ser inferior a 6 caracteres y poseer letras"
                    }).then(function () {
                        focus('nombre');
                    });
                    return false;
                }

                // validacion de correo electr�nico:
                patron = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
                if (String($scope.crear.email).search(patron) < 0) {
                    $ionicPopup.alert({
                        title: 'Alerta!',
                        template: "'Correo Electrónico' no posee caracteres válidos"
                    }).then(function () {
                        focus('email');
                    });

                    return false;
                }

//                // validacion de contrase�as: longitud de la contrase�a
                if (($scope.crear.pass1 + '').length < 5) {
                    $ionicPopup.alert({
                        title: 'Alerta!',
                        template: "La Contrase\u00F1a no debe ser inferior a 6 caracteres"
                    }).then(function () {
                        focus('password1');
                    });

                    return false;
                }
//
//                console.log($scope.crear.pass1);
//                console.log($scope.crear.pass2);
                // validacion de contrase�as: igualdad de caracteres entre contrase�a1 y contrase�a2
                if (String($scope.crear.pass1) != String($scope.crear.pass2)) {
                    $ionicPopup.alert({
                        title: 'Alerta!',
                        template: "Ambas contrase\u00F1as deben coincidir"
                    }).then(function () {
                        focus('password2');
                    });

                    return false;
                }
                return true;
            };
        })
        .controller('modalCtrl', function ($scope, $state, $ionicHistory) {


            $scope.salir = function () {

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $state.go('app.login');
                $scope.modal.remove();
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

        .controller('PlacaCtrl', function ($scope, $stateParams) {

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

        .controller('BrowserCtrl', function ($scope, $http, $state, $ionicHistory, $ionicPopup) {

            $scope.cargar = false;
            $scope.inputVal = '';
            $scope.items = [];
            $scope.cargarCoor = function (item) {

                var placa = item.split(' | ');

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $ionicHistory.clearCache().then(function () {
                    $state.go('app.playlists', {placa: placa[0]}, {reload: true});
                });
            };

            $scope.buscar = function (dato) {

                $scope.items.length = 0;
                $scope.items = [];

                if (dato != '' && dato.length > 2) {

                    $scope.cargar = true;

                    $http({
                        method: 'GET',
                        url: 'http://sigmin.co/Services/sgm_service_multicriterio_mobile.php',
                        params: {'multicriterio': dato},
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function successCallback(response) {

                        $scope.cargar = false;
                        var obj = response.data;
                        angular.forEach(obj, function (value, key) {

                            var obj2 = value;
                            var tipo = (key == 'solicitudes') ? 'Sol' : 'Til';

                            angular.forEach(obj2, function (value, key) {
                                $scope.items.push(value.placa + ' | ' + tipo + ' | ' + value.municipios.charAt(0).toUpperCase() + value.municipios.substr(1, value.municipios.length).toLowerCase());
                            });
                        });
                    }, function errorCallback(e) {

                        $ionicPopup.alert({
                            title: 'Falla de acceso!',
                            template: 'Error de comunicacion, revise su conexion'
                        });
                    });
                }
            };
        });
