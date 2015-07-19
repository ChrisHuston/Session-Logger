var VideoModalCtrl = function ($scope, $modalInstance, src, resource, $timeout) {
    $scope.close = function () {
        $modalInstance.close($modalInstance);
    };

    $scope.cancel = function () {
        $modalInstance.close($modalInstance);
    };

    $modalInstance.opened.then(function() {
        $timeout(function() {
            console.log($modalInstance);
            $modalInstance.start_view = new Date().getTime();
            $modalInstance.resource = resource;
            var popup = $(".k-modal");
            var kVideoPlayer = videojs($("#k_video")[0],
                {'controls': true,'autoplay': true, 'preload': 'auto',
                    'playbackRates': [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 2.0]});

            kVideoPlayer.src({ type: "video/mp4", src: src });
            kVideoPlayer.ready(function() {
                //console.log(kVideoPlayer.videoHeight);
            });
            kVideoPlayer.on("loadedmetadata", function(evt) {
                var viewport = {width: $(window).width()/2, height: $(window).height()/2};
                var v = evt.currentTarget;
                if (v !== undefined && !isNaN(v.videoHeight) && v.videoHeight > 20) {
                    var pHeight = v.videoHeight + 50;
                    var pWidth = v.videoWidth + 25;
                } else {
                    pHeight = 360;
                    pWidth = 640;
                }
                var heightRatio = viewport.height/pHeight;
                var widthRatio = viewport.width/pWidth;
                if (heightRatio < widthRatio) {
                    if (heightRatio < 1) {
                        pHeight = heightRatio * pHeight;
                        pWidth = heightRatio * pWidth;
                    }
                } else {
                    if (widthRatio < 1) {
                        pHeight = widthRatio * pHeight;
                        pWidth = widthRatio * pWidth;
                    }
                }
                pWidth = Math.max(pWidth, 720);
                pHeight = Math.max(pHeight, 405);

                var kv = $("#k_video");
                kv.width(pWidth-25);
                kv.height(pHeight-50);

                this.play();
                popup.width(pWidth);
                popup.height(pHeight);
                popup.css('top', "50px");
                popup.css('left', "10px");
            });
            popup.draggable({ containment: "window" , cancel: "div.vjs-control-bar" });
            popup.resizable({
                start: function( event, ui ) {ui.element.css("position","fixed")},
                resize:function(event, ui) {
                    var kv = $("#k_video");
                    kv.width(ui.size.width-25);
                    kv.height(ui.size.height-50);
                },
                stop: function( event, ui ) {ui.element.css("position","fixed")}});
        }, 500, true);

    });
};

var FlashModalCtrl = function ($scope, $modalInstance, src, resource, $timeout) {
    $scope.close = function () {
        $modalInstance.close($modalInstance);
    };

    $scope.cancel = function () {
        $modalInstance.close($modalInstance);
    };

    $modalInstance.opened.then(function() {
        $timeout(function() {
            $modalInstance.start_view = new Date().getTime();
            $modalInstance.resource = resource;
            var popup = $(".k-modal");
            popup.draggable({ containment: "window", cancel: "object" });
            popup.css({height: 550, width: 950});
            popup.css('top', "50px");
            //console.log($("object")[0]);
            //$("object")[0].data = src;
            //$("object")[1].data = src;
            swfobject.embedSWF(src, "flash-content", "900", "500", "10.0.0");
        }, 100, true);

    });
};

var ImageModalCtrl = function ($scope, $modalInstance, src, resource, $timeout) {
    $scope.close = function () {
        $modalInstance.close($modalInstance);
    };

    $scope.cancel = function () {
        $modalInstance.close($modalInstance);
    };

    $modalInstance.opened.then(function() {
        $timeout(function() {
            $modalInstance.start_view = new Date().getTime();
            $modalInstance.resource = resource;
            var popup = $(".k-modal");
            popup.draggable({ containment: "window"});
            popup.resizable({aspectRatio: true,
                start: function( event, ui ) {ui.element.css("position","fixed")},
                stop: function( event, ui ) {ui.element.css("position","fixed")}});

            var k_img = $("#k-modal-img");
            k_img.attr("src",src);
            var initImg = function() {
                var viewport = {width: $(window).width()-50, height: $(window).height()-50};
                var pHeight = k_img[0].naturalHeight + 50;
                var pWidth = k_img[0].naturalWidth + 50;
                var heightRatio = viewport.height/pHeight;
                var widthRatio = viewport.width/pWidth;
                if (heightRatio < widthRatio) {
                    if (heightRatio < 1) {
                        pHeight = heightRatio * pHeight;
                        pWidth = heightRatio * pWidth;
                    }
                } else {
                    if (widthRatio < 1) {
                        pHeight = widthRatio * pHeight;
                        pWidth = widthRatio * pWidth;
                    }
                }
                popup.css({height: pHeight, width: pWidth});
                popup.css('top', "50px");
                popup.css('left', "10px");
            };
            k_img[0].onload = initImg;

        }, 100, true);

    });
};

var PasswordModalCtrl = function ($scope, $modalInstance) {
    $scope.submitPw = function () {
        $modalInstance.close($scope.module_pw);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


var DiscussionModalCtrl = function ($scope, $modalInstance, $timeout) {
    $scope.close = function () {
        $modalInstance.close($modalInstance);
    };

    $scope.cancel = function () {
        $modalInstance.close($modalInstance);
    };

    $modalInstance.opened.then(function() {
        var viewport = {width: $(window).width()-50, height: $(window).height()-50};
        var w = Math.min(viewport.width, 730);
        $timeout(function() {
            var popup = $(".k-modal");
            popup.draggable({ containment: "window" });
            if (viewport.width < 600) {
                var height_offset = 210;
            } else {
                height_offset = 180;
            }
            popup.resizable({aspectRatio: false,
                start: function( event, ui ) {ui.element.css("position","fixed")},
                resize:function(event, ui) {
                    var resizeHeight = ui.size.height-height_offset;
                    tinyMCE.DOM.setStyle(tinyMCE.DOM.get("k-discussion-postTxt" + '_ifr'), 'height', resizeHeight + 'px');
                },
                stop: function( event, ui ) {ui.element.css("position","fixed")}});

            var h = Math.min(viewport.height, 310);
            var ed2 = new tinymce.Editor('k-discussion-postTxt', {
                selector: "textarea",
                menubar: false,
                statusbar: false,
                auto_focus: "k-discussion-postTxt",
                content_css : "styles/tiny_style.css",
                plugins: [
                    "advlist autolink lists link charmap",
                    "searchreplace visualblocks",
                    "insertdatetime table paste textcolor"
                ],
                toolbar: "bold italic textcolor | subscript superscript | alignleft aligncenter alignright | bullist numlist table | link charmap"
            }, tinymce.EditorManager);

            ed2.render();

            setTimeout(function() {
                tinyMCE.DOM.setStyle(tinyMCE.DOM.get("k-discussion-postTxt" + '_ifr'), 'height', (h-height_offset) + 'px');
                if ($scope.post_obj !== null && !$scope.is_reply) {
                    tinymce.get('k-discussion-postTxt').setContent($scope.post_obj.post_txt);
                } else {
                    //tinymce.get('k-discussion-postTxt').setContent("");
                }
            }, 500);
            popup.css('width', w+"px");
            popup.css('height', h+"px");

        }, 100, true);

    });
};

var DbqModalCtrl = function ($scope, $modalInstance, $timeout) {
    $scope.close = function () {
        $modalInstance.close($modalInstance);
    };

    $scope.cancel = function () {
        $modalInstance.close($modalInstance);
    };

    $modalInstance.opened.then(function() {
        var viewport = {width: $(window).width()-50, height: $(window).height()-50};
        var w = Math.min(viewport.width, 730);
        $timeout(function() {
            var popup = $(".k-modal");
            popup.draggable({ containment: "window" });
            if (viewport.width < 600) {
                var dbq_offset = 162;
            } else {
                dbq_offset = 130;
            }

            popup.resizable({aspectRatio: false,
                start: function( event, ui ) {ui.element.css("position","fixed")},
                resize:function(event, ui) {
                    if (ui.size.width < 516) {
                        dbq_offset = 162;
                    } else {
                        dbq_offset = 130;
                    }
                    var resizeHeight = ui.size.height-dbq_offset;
                    tinyMCE.DOM.setStyle(tinyMCE.DOM.get("k-postTxt" + '_ifr'), 'height', resizeHeight + 'px');
                },
                stop: function( event, ui ) {ui.element.css("position","fixed")}});

            var h = Math.min(viewport.height, 350);

            var ed = new tinymce.Editor('k-postTxt', {
                selector: "textarea",
                menubar: false,
                statusbar: false,
                auto_focus: "k-postTxt",
                content_css : "styles/tiny_style.css",
                plugins: [
                    "advlist autolink lists link charmap",
                    "searchreplace visualblocks",
                    "insertdatetime table paste textcolor"
                ],
                toolbar: "bold italic textcolor | subscript superscript | alignleft aligncenter alignright | bullist numlist table | link charmap"
            }, tinymce.EditorManager);

            ed.render();

            setTimeout(function() {
                console.log(dbq_offset, h);
                tinyMCE.DOM.setStyle(tinyMCE.DOM.get("k-postTxt" + '_ifr'), 'height', (h-dbq_offset) + 'px');
                if ($scope.post_obj !== null && !$scope.is_reply) {
                    tinymce.get('k-postTxt').setContent($scope.post_obj.post_txt);
                } else {
                    //tinymce.get('k-postTxt').setContent("");
                }
            }, 200);

            popup.css('width', w+"px");
            popup.css('height', h+"px");

        }, 100, true);

    });
};

var UnitDoneModalCtrl = function ($scope, $modalInstance, $timeout) {
    $scope.close = function () {
        $modalInstance.close($modalInstance);
    };

    $scope.cancel = function () {
        $modalInstance.close($modalInstance);
    };

    $modalInstance.opened.then(function() {
        var viewport = {width: $(window).width()-50, height: $(window).height()-50};
        var w = Math.min(viewport.width, 730);
        $timeout(function() {
            var popup = $(".k-modal");
            popup.css('width', w+"px");
            popup.css('height', h+"px");

        }, 100, true);

    });
};