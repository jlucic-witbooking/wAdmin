'use strict';

angular.module('adminApp')
    .controller('MainController', function ($scope, $state, Principal) {
        Principal.identity().then(function (account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
/*
            if(!$scope.isAuthenticated()){
                $state.go('login');
            }
*/
        });
    })
    .controller('AppController',
    ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar',
        function ($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar) {
            "use strict";

            // Setup the layout mode
            $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout == 'app-h');

            // Loading bar transition
            // -----------------------------------
            var thBar;
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if ($('.wrapper > section').length) // check if bar container exists
                    thBar = $timeout(function () {
                        cfpLoadingBar.start();
                    }, 0); // sets a latency Threshold
            });
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                event.targetScope.$watch("$viewContentLoaded", function () {
                    $timeout.cancel(thBar);
                    cfpLoadingBar.complete();
                });
            });


            // Hook not found
            $rootScope.$on('$stateNotFound',
                function (event, unfoundState, fromState, fromParams) {
                    console.log(unfoundState.to); // "lazy.state"
                    console.log(unfoundState.toParams); // {a:1, b:2}
                    console.log(unfoundState.options); // {inherit:false} + default options
                });
            // Hook error
            $rootScope.$on('$stateChangeError',
                function (event, toState, toParams, fromState, fromParams, error) {
                    console.log(error);
                });
            // Hook success
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    // display new view from top
                    $window.scrollTo(0, 0);
                    // Save the route title
                    $rootScope.currTitle = $state.current.title;
                });

            $rootScope.currTitle = $state.current.title;
            $rootScope.pageTitle = function () {
                var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
                document.title = title;
                return title;
            };

            // iPad may presents ghost click issues
            // if( ! browser.ipad )
            // FastClick.attach(document.body);

            // Close submenu when sidebar change from collapsed to normal
            $rootScope.$watch('app.layout.isCollapsed', function (newValue, oldValue) {
                if (newValue === false)
                    $rootScope.$broadcast('closeSidebarMenu');
            });

            // Restore layout settings
            if (angular.isDefined($localStorage.layout))
                $scope.app.layout = $localStorage.layout;
            else
                $localStorage.layout = $scope.app.layout;

            $rootScope.$watch("app.layout", function () {
                $localStorage.layout = $scope.app.layout;
            }, true);


            // Allows to use branding color with interpolation
            // {{ colorByName('primary') }}
            $scope.colorByName = colors.byName;

            // Internationalization
            // ----------------------

            $scope.language = {
                // Handles language dropdown
                listIsOpen: false,
                // list of available languages
                available: {
                    'en': 'English',
                    'es_AR': 'Español'
                },
                // display always the current ui language
                init: function () {
                    var proposedLanguage = $translate.proposedLanguage() || $translate.use();
                    var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
                    $scope.language.selected = $scope.language.available[(proposedLanguage || preferredLanguage)];
                },
                set: function (localeId, ev) {
                    // Set the new idiom
                    $translate.use(localeId);
                    // save a reference for the current language
                    $scope.language.selected = $scope.language.available[localeId];
                    // finally toggle dropdown
                    $scope.language.listIsOpen = !$scope.language.listIsOpen;
                }
            };

            $scope.language.init();

            // Restore application classes state
            toggle.restoreState($(document.body));

            // cancel click event easily
            $rootScope.cancel = function ($event) {
                $event.stopPropagation();
            };

        }])
    .controller('SidebarController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils',
        function ($rootScope, $scope, $state, $http, $timeout, Utils) {

            var collapseList = [];

            // demo: when switch from collapse to hover, close all items
            $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
                if (newVal === false && oldVal === true) {
                    closeAllBut(-1);
                }
            });

            // Check item and children active state
            var isActive = function (item) {

                if (!item) return;

                if (!item.sref || item.sref == '#') {
                    var foundActive = false;
                    angular.forEach(item.submenu, function (value, key) {
                        if (isActive(value)) foundActive = true;
                    });
                    return foundActive;
                }
                else
                    return $state.is(item.sref) || $state.includes(item.sref);
            };

            // Load menu from json file
            // -----------------------------------

            $scope.getMenuItemPropClasses = function (item) {
                return (item.heading ? 'nav-heading' : '') +
                    (isActive(item) ? ' active' : '');
            };

            $scope.loadSidebarMenu = function () {

                var menuJson = 'server/sidebar-menu.json',
                    menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
                $scope.menuItems=[
                    {
                        "text": "Menu Heading",
                        "heading": "true",
                        "translate": "sidebar.heading.HEADER"
                    },
                    {
                        "text": "Single View",
                        "sref": "app.singleview",
                        "icon": "fa fa-file-o",
                        "translate": "sidebar.nav.SINGLEVIEW"
                    },
                    {
                        "text": "Menu",
                        "sref": "#",
                        "icon": "icon-folder",
                        "submenu": [
                            { "text": "Sub Menu",
                                "sref": "app.submenu",
                                "translate": "sidebar.nav.menu.SUBMENU"
                            }
                        ],
                        "translate": "sidebar.nav.menu.MENU"
                    }
                ];

                $scope.menuItems=[
                    {
                        "text": "Menu Heading",
                        "heading": "true",
                        "translate": "sidebar.heading.HEADER"
                    },
                    {
                        "text": "Reservations",
                        "sref": "#",
                        "icon": "fa fa-file-o",
                        "translate": "sidebar.nav.RESERVATIONS",
                        "submenu": [
                            {   "text": "List",
                                "sref": "reservation.list",
                                "translate": "sidebar.nav.reservations.LIST"
                            },
                            {   "text": "Occupancy",
                                "sref": "reservation.occupancy",
                                "translate": "sidebar.nav.reservations.OCCUPANCY"
                            },
                            {   "text": "Check-ins/Check-outs",
                                "sref": "reservation.checkinscheckouts",
                                "translate": "sidebar.nav.reservations.CHECKINSCHECKOUTS"
                            },
                            {   "text": "Insert Booking",
                                "sref": "reservation.booking",
                                "translate": "sidebar.nav.reservations.BOOKING"
                            },
                        ]
                    },
                    {
                        "text": "Inventory",
                        "sref": "#",
                        "icon": "fa fa-file-o",
                        "translate": "sidebar.nav.INVENTORY",
                        "submenu": [
                            {   "text": "Management",
                                "sref": "inventory.management",
                                "translate": "sidebar.nav.inventory.MANAGEMENT"
                            },
                            {   "text": "Extras",
                                "sref": "inventory.extras",
                                "translate": "sidebar.nav.inventory.EXTRAS"
                            },
                            {   "text": "Promotions",
                                "sref": "inventory.promotions",
                                "translate": "sidebar.nav.inventory.PROMOTIONS"
                            }
                        ]
                    },
                    {
                        "text": "Reports",
                        "sref": "#",
                        "icon": "fa fa-file-o",
                        "translate": "sidebar.nav.REPORTS",
                        "submenu": [
                            {   "text": "Reservations List",
                                "sref": "reports.reservationslist",
                                "translate": "sidebar.nav.reports.reservationslist"
                            },
                            {   "text": "Extended Reservations List",
                                "sref": "reports.extendedreservationslist",
                                "translate": "sidebar.nav.reports.extendedreservationslist"
                            },
                            {   "text": "Visitors List",
                                "sref": "reports.visitorslist",
                                "translate": "sidebar.nav.reports.visitorslist"
                            },
                            {   "text": "Inventory List",
                                "sref": "reports.inventorylist",
                                "translate": "sidebar.nav.reports.inventorylist"
                            },
                            {   "text": "ABC Clients",
                                "sref": "reports.clients",
                                "translate": "sidebar.nav.reports.clients"
                            },
                            {   "text": "Reservations By Establishment",
                                "sref": "reports.reservationsbyestablishment",
                                "translate": "sidebar.nav.reports.reservationsbyestablishment"
                            },
                            {   "text": "Reservations By Agent",
                                "sref": "reports.reservationsbyagent",
                                "translate": "sidebar.nav.reports.reservationsbyagent"
                            },
                            {   "text": "Cancellations List",
                                "sref": "reports.cancellationslist",
                                "translate": "sidebar.nav.reports.cancellationslist"
                            },
                            {   "text": "Performance",
                                "sref": "reports.performance",
                                "translate": "sidebar.nav.reports.performance"
                            },
                            {   "text": "Surveys",
                                "sref": "reports.surveys",
                                "translate": "sidebar.nav.reports.surveys"
                            },
                            {   "text": "Survey Results",
                                "sref": "reports.surveyresults",
                                "translate": "sidebar.nav.reports.surveyresults"
                            },

                        ]
                    },
                    {
                        "text": "Communications",
                        "sref": "#",
                        "icon": "fa fa-file-o",
                        "translate": "sidebar.nav.COMMUNICATIONS",
                        "submenu": [
                            {
                                "text": "Booking Engine Messages",
                                "sref": "communications.messages",
                                "translate": "sidebar.nav.communications.messages"
                            },
                            {
                                "text": "Low availability alert",
                                "sref": "communications.lowavailability",
                                "translate": "sidebar.nav.communications.lowavailability"
                            },
                            {
                                "text": "Reservation horizon alert",
                                "sref": "communications.reservationhorizon",
                                "translate": "sidebar.nav.communications.reservationhorizon"
                            },
                            {
                                "text": "Confirmation emails",
                                "sref": "communications.confirmationemails",
                                "translate": "sidebar.nav.communications.confirmationemails"
                            },
                            {
                                "text": "Pre-Stay emails",
                                "sref": "communications.prestayemails",
                                "translate": "sidebar.nav.communications.prestayemails"
                            },
                            {
                                "text": "Post-Stay emails",
                                "sref": "communications.poststayemails",
                                "translate": "sidebar.nav.communications.poststayemails"
                            },
                            {
                                "text": "Reservation emails list",
                                "sref": "communications.reservationemailslist",
                                "translate": "sidebar.nav.communications.reservationemailslist"
                            },
                            {
                                "text": "Newsletter emails list",
                                "sref": "communications.newsletteremailslist",
                                "translate": "sidebar.nav.communications.newsletteremailslist"
                            },
                        ]
                    },
                    {
                        "text": "Web Contents",
                        "sref": "#",
                        "icon": "fa fa-file-o",
                        "translate": "sidebar.nav.WEBCONTENTS",
                        "submenu": [
                            {
                                "text": "Navigation Bar",
                                "sref": "webcontents.navbar",
                                "translate": "sidebar.nav.webcontents.navbar"
                            },
                            {
                                "text": "Static Pages",
                                "sref": "webcontents.staticpages",
                                "translate": "sidebar.nav.webcontents.staticpages"
                            },
                            {
                                "text": "Social networks",
                                "sref": "webcontents.socialnetwork",
                                "translate": "sidebar.nav.webcontents.socialnetwork",
                                "submenu": [
                                    {
                                        "text": "links",
                                        "sref": "webcontents.socialnetwork.links",
                                        "translate": "sidebar.nav.webcontents.socialnetworks.links"
                                    },
                                    {
                                        "text": "Widgets",
                                        "sref": "webcontents.socialnetwork.widgets",
                                        "translate": "sidebar.nav.webcontents.socialnetworks.widgets"
                                    }
                                ]
                            },
                            {
                                "text": "Location",
                                "sref": "webcontents.location",
                                "translate": "sidebar.nav.webcontents.location",
                                "submenu": [
                                    {
                                        "text": "Guide",
                                        "sref": "webcontents.location.Guide",
                                        "translate": "sidebar.nav.webcontents.locations.guide"
                                    },
                                    {
                                        "text": "How to get here",
                                        "sref": "webcontents.location.howtogethere",
                                        "translate": "sidebar.nav.webcontents.locations.howtogethere"
                                    }
                                ]
                            },
                            {
                                "text": "Testimonials",
                                "sref": "webcontents.testimonials",
                                "translate": "sidebar.nav.webcontents.testimonials"
                            },
                            {
                                "text": "Configuration",
                                "sref": "#",
                                "icon": "fa fa-file-o",
                                "translate": "sidebar.nav.CONFIGURATION",
                                "submenu": [
                                    {   "text": "Establishment Info",
                                        "sref": "configuration.establishmentinfo",
                                        "translate": "sidebar.nav.configuration.establishmentinfo"
                                    },
                                    {   "text": "Parameterization",
                                        "sref": "configuration.parameterization",
                                        "translate": "sidebar.nav.configuration.parameterization"
                                    },
                                    {   "text": "Appearance",
                                        "sref": "configuration.appearance",
                                        "translate": "sidebar.nav.configuration.appearance"
                                    },
                                    {   "text": "Define Inventory",
                                        "sref": "configuration.defineinventory",
                                        "translate": "sidebar.nav.configuration.defineinventory"
                                    },
                                    {   "text": "Batch Create Inventory",
                                        "sref": "configuration.batchcreatehinventory",
                                        "translate": "sidebar.nav.configuration.batchcreatehinventory"
                                    },
                                    {   "text": "Batch Edit Inventory",
                                        "sref": "configuration.batchedithinventory",
                                        "translate": "sidebar.nav.configuration.batchedithinventory"
                                    },
                                    {   "text": "Change Passowrd",
                                        "sref": "configuration.changepassowrd",
                                        "translate": "sidebar.nav.configuration.changepassowrd"
                                    },
                                ]
                            },
                            {
                                "text": "Admin",
                                "sref": "#",
                                "icon": "fa fa-file-o",
                                "translate": "sidebar.nav.ADMIN",
                                "submenu": [
                                    {   "text": "User Authorization",
                                        "sref": "admin.authorization",
                                        "translate": "sidebar.nav.admin.authorization"
                                    },
                                    {   "text": "Create Establishment",
                                        "sref": "admin.createestablishment",
                                        "translate": "sidebar.nav.admin.createestablishment"
                                    },
                                    {   "text": "Create Group",
                                        "sref": "admin.creategroup",
                                        "translate": "sidebar.nav.admin.creategroup"
                                    },
                                    {   "text": "Contract List",
                                        "sref": "admin.contractlist",
                                        "translate": "sidebar.nav.admin.contractlist"
                                    },
                                    {   "text": "Active Contracts List",
                                        "sref": "admin.batchcreatehinventory",
                                        "translate": "sidebar.nav.admin.batchcreatehinventory"
                                    },
                                ]
                            }
                        ]
                    }

                ]

/*
                $http.get(menuURL)
                    .success(function (items) {
                        $scope.menuItems = items;
                    })
                    .error(function (data, status, headers, config) {
                        alert('Failure loading menu');
                    });
*/
            };

            $scope.loadSidebarMenu();

            // Handle sidebar collapse items
            // -----------------------------------

            $scope.addCollapse = function ($index, item) {
                collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
            };

            $scope.isCollapse = function ($index) {
                return (collapseList[$index]);
            };

            $scope.toggleCollapse = function ($index, isParentItem) {


                // collapsed sidebar doesn't toggle drodopwn
                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

                // make sure the item index exists
                if (angular.isDefined(collapseList[$index])) {
                    if (!$scope.lastEventFromChild) {
                        collapseList[$index] = !collapseList[$index];
                        closeAllBut($index);
                    }
                }
                else if (isParentItem) {
                    closeAllBut(-1);
                }

                $scope.lastEventFromChild = isChild($index);

                return true;

            };

            function closeAllBut(index) {
                index += '';
                for (var i in collapseList) {
                    if (index < 0 || index.indexOf(i) < 0)
                        collapseList[i] = true;
                }
            }

            function isChild($index) {
                return (typeof $index === 'string') && !($index.indexOf('-') < 0);
            }

        }]);
