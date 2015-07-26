'use strict';

/**
 * @ngdoc object
 * @name chat.Controllers.ChatController
 * @description ChatController
 * @requires ng.$scope
 */
angular
    .module('chat')
    .controller('ChatController', [
        '$scope', '$state', '$rootScope', '$interval',
        function ($scope, $state, $rootScope, $interval) {
            if (!$rootScope.phonenumber) {
                $state.go("register");
                return;
            }


            $scope.back = function () {
                $rootScope.person = '';
                $state.go("contacts");
            }


            var uuid, avatar, color, cat;

            // Assign a uuid made of a random cat and a random color
            var randomColor = function () {
                var colors = ['navy', 'slate', 'olive', 'moss', 'chocolate', 'buttercup', 'maroon', 'cerise', 'plum', 'orchid'];
                return colors[(Math.random() * colors.length) >>> 0];
            };

            var randomCat = function () {
                var cats = ['tabby', 'bengal', 'persian', 'mainecoon', 'ragdoll', 'sphynx', 'siamese', 'korat', 'japanesebobtail', 'abyssinian', 'scottishfold'];
                return cats[(Math.random() * cats.length) >>> 0];
            };

            color = randomColor();
            cat = randomCat();
            uuid = color + '-' + cat;
            avatar = 'img/ic_account_circle_128.png';

            function showNewest() {
                //document.querySelector('core-scaffold').$.headerPanel.scroller.scrollTop = document.querySelector('.chat-list').scrollHeight;
                var chatDiv = document.querySelector('.chat-list');
                if (chatDiv)
                    chatDiv.scrollTop = chatDiv.scrollHeight;
            }

            /* Polymer UI and UX */

            var template = document.querySelector('template[is=auto-binding]');

            template.channel = 'polymer-chat';
            template.uuid = uuid;
            template.avatar = avatar;
            template.color = color;

            template.checkKey = function (e) {
                if (e.keyCode === 13 || e.charCode === 13) {
                    template.publish();
                }
            };

            template.sendMyMessage = function (e) {
                template.publish();
            };

            // Cargar los ultimos (x) mensajes recibidos por person.name
            template.messageList = $rootScope.person.messages;


            /* PubNub Realtime Chat */

            var pastMsgs = [];
            var onlineUuids = [];

            template.getListWithOnlineStatus = function (list) {
                [].forEach.call(list, function (l) {
                    // sanitize avatars
                    var catName = (l.uuid + '').split('-')[1];
                    l.avatar = 'images/' + catName + '.jpg';

                    if (catName === undefined || /\s/.test(l.uuid)) {
                        l.uuid = 'fail-cat';
                        console.log('Oh you, I made this demo open so nice devs can play with, but you are soiling everything :-(');
                    }

                    if (onlineUuids.indexOf(l.uuid) > -1) {
                        l.status = 'online';
                    } else {
                        l.status = 'offline';
                    }
                });
                return list;
            };

            template.displayChatList = function (list) {
                template.messageList = list;
                // scroll to bottom when all list items are displayed
                template.async(showNewest);
            };

            template.subscribeCallback = function (e) {
                if (template.$.sub.messages.length > 0) {
                    this.displayChatList(pastMsgs.concat(this.getListWithOnlineStatus(template.$.sub.messages)));
                }
            };

            template.presenceChanged = function (e) {
                var i = 0;
                var l = template.$.sub.presence.length;
                var d = template.$.sub.presence[l - 1];

                // how many users
                template.occupancy = d.occupancy;

                // who are online
                if (d.action === 'join') {
                    if (d.uuid.length > 35) { // console
                        d.uuid = 'the-mighty-big-cat';
                    }
                    onlineUuids.push(d.uuid);
                } else {
                    var idx = onlineUuids.indexOf(d.uuid);
                    if (idx > -1) {
                        onlineUuids.splice(idx, 1);
                    }
                }

                i++;

                // display at the left column
                template.cats = onlineUuids;
                // update the status at the main column
                if (template.messageList.length > 0) {
                    template.messageList = this.getListWithOnlineStatus(template.messageList);
                }
            };

            template.historyRetrieved = function (e) {
                if (e.detail[0].length > 0) {
                    pastMsgs = this.getListWithOnlineStatus(e.detail[0]);
                    this.displayChatList(pastMsgs);
                }
            };

            template.publish = function () {
                if (!template.input) return;

                var id_Inserted;

                template.messageList[template.messageList.length] = {
                    uuid: "Me",
                    avatar: avatar,
                    color: 'navy',
                    text: template.input,
                    status: 'waiting',
                    timestamp: new Date().toISOString()
                };

                // Insertar en la base de datos local (SQlite) los mensajes enviados
                $rootScope.db.transaction(function (tx) {

                    tx.executeSql("INSERT INTO chat_table (uuid, person_name, text, status, created_at, sent_at, received_at, read_at) VALUES (?,?,?,?,?,?,?,?);", ["Me", $rootScope.person.name, template.input, "created", new Date().toISOString(), null, null, null], function (tx, res) {
                        id_Inserted = res.insertId;
                        console.log("insertId: " + res.insertId + " -- probably 1");
                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                    }, function (e) {
                        console.log("ERROR: " + e.message);
                    });

                });

                $rootScope.person.messages = template.messageList;

                if (easyrtc.lost_connection[$rootScope.person.name]) {
                    easyrtc.sendDataP2P($rootScope.person.name, "message", template.input);
                    // Status update

                }
                else {
                    easyrtc.sendDataWS($rootScope.person.name, "message", template.input);
                    // Status update
                    $rootScope.db.transaction(function (tx) {
                        tx.executeSql("UPDATE chat_table SET status = 'sent' WHERE id = ?;", [id_Inserted], function (tx, res) {
                            console.log("Last updated ID = " + res.insertId);
                            console.log("insertId: " + res.insertId + " -- probably 1");
                            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                        }, function (e) {
                            console.log("ERROR: " + e.message);
                        });

                    });
                }

                template.input = '';
                template.async(showNewest);
            };

            template.error = function (e) {
                console.log(e);
            };

            template.addEventListener('template-bound', function () {
                template.async(showNewest);
            });

            $rootScope.scrollToEnd = function () {
                template.async(showNewest);
            }

        }
    ]);
